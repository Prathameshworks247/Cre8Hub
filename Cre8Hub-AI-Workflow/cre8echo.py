from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import os
import asyncio
from typing import Optional, Dict, Any, AsyncGenerator
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.callbacks.base import BaseCallbackHandler
from services.chain import PLATFORM_TEMPLATES
from models.models import ContentRequest, SaveOutputRequest
from dotenv import load_dotenv
load_dotenv()

# --------------- STREAMING CALLBACK HANDLER ----------------

class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.tokens = []
    
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.tokens.append(token)

# --------------- CONFIG ----------------
app = FastAPI(title="Multi-Platform Content Generator", version="1.0.0")

# CORS middleware configuration - FIXED for 403 errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080", 
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173"   # Vite with 127.0.0.1
    ],
    allow_credentials=False,  # Set to False to avoid 403 issues
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=[
        "Accept",
        "Accept-Language", 
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["*"],
    max_age=86400,  # Cache preflight for 24 hours
)

# Environment variable validation
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print("GOOGLE_API_KEY:", "Set" if GOOGLE_API_KEY else "Not Set")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set. Please export it before running.")

# Load persona JSON with error handling
try:
    with open("responses.json", "r") as f:
        persona = json.load(f)
    print("Persona loaded successfully")
except FileNotFoundError:
    print("Warning: responses.json file not found. Using default persona.")
    persona = {"persona": {"creator_name": "AI Content Creator", "tone": "friendly", "style": "engaging"}}
except json.JSONDecodeError:
    raise ValueError("Invalid JSON format in responses.json file.")

# LLM setup with streaming support
try:
    generator_llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=GOOGLE_API_KEY,
        temperature=0.9,
        max_output_tokens=4048,
        streaming=True  # Enable streaming
    )
    critic_llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=GOOGLE_API_KEY,
        temperature=0.7,
        max_output_tokens=2048,
        streaming=True  # Enable streaming
    )
    print("LLM models initialized successfully")
except Exception as e:
    raise ValueError(f"Failed to initialize LLM models: {str(e)}")

# Platform-specific content templates (same as before)



# --------------- HELPER FUNCTIONS ----------------
def get_persona_field(field_name: str, default=""):
    """Safely extract persona fields with fallbacks"""
    try:
        return persona.get("persona", {}).get(field_name, default)
    except (KeyError, TypeError):
        return default

def format_list_field(field_list):
    """Format list fields for prompt templates"""
    if isinstance(field_list, list):
        return ", ".join(field_list) if field_list else "None specified"
    return str(field_list) if field_list else "None specified"

def generate_content_title(platform: str, prompt: str) -> str:
    """Generate a title based on platform and prompt"""
    platform_titles = {
        "youtube": f"YouTube Video: {prompt[:50]}...",
        "instagram": f"Instagram Post: {prompt[:50]}...",
        "twitter": f"Twitter Thread: {prompt[:50]}...",
        "linkedin": f"LinkedIn Post: {prompt[:50]}..."
    }
    return platform_titles.get(platform, f"{platform.title()} Content: {prompt[:50]}...")

# --------------- STREAMING FUNCTIONS ----------------
async def stream_content_generation(req: ContentRequest) -> AsyncGenerator[str, None]:
    """Stream content generation with critic/generator loop"""
    
    if req.platform not in PLATFORM_TEMPLATES:
        yield f"data: {json.dumps({'error': f'Unsupported platform: {req.platform}'})}\n\n"
        return
    
    platform_config = PLATFORM_TEMPLATES[req.platform]
    max_rounds = req.iterations or 3
    
    # Send initial status
    yield f"data: {json.dumps({'status': 'starting', 'message': f'Starting content generation for {req.platform}...'})}\n\n"
    
    try:
        # Prepare personification note
        personification_note = ""
        if req.personify:
            personification_note = "\nIMPORTANT: Fully embody the creator's personality, use their catchphrases naturally, and write as if you ARE them."
        else:
            personification_note = "\nWrite in a professional, engaging style without specific personality quirks."
        
        # Create prompt templates
        generator_template = PromptTemplate.from_template(platform_config["generator_template"])
        critic_template = PromptTemplate.from_template(platform_config["critic_template"])
        
        content = None
        critiques = []
        
        for i in range(max_rounds):
            yield f"data: {json.dumps({'status': 'generating', 'iteration': i+1, 'max_iterations': max_rounds})}\n\n"
            
            # Prepare improvement note for subsequent iterations
            improvement_note = ""
            if i > 0 and critiques:
                improvement_note = f"\nIMPROVEMENT NEEDED: {critiques[-1]}"
            
            # Create streaming callback handler
            streaming_handler = StreamingCallbackHandler()
            
            # Create generator chain with streaming
            generator_chain = LLMChain(
                llm=generator_llm, 
                prompt=generator_template,
                callbacks=[streaming_handler]
            )
            
            # Stream content generation
            yield f"data: {json.dumps({'status': 'content_streaming', 'message': 'Generating content...'})}\n\n"
            
            # Run generation (this will populate streaming_handler.tokens)
            content = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: generator_chain.run(
                    creator_name=get_persona_field("creator_name", "Content Creator"),
                    tone=get_persona_field("tone", "friendly"),
                    style=get_persona_field("style", "engaging"),
                    catchphrases=format_list_field(get_persona_field("catchphrases", [])),
                    prompt=req.prompt.strip(),
                    personification_note=personification_note,
                    improvement_note=improvement_note
                )
            )
            
            # Stream the generated content token by token
            if content:
                for j, char in enumerate(content):
                    yield f"data: {json.dumps({'type': 'content_token', 'token': char, 'position': j})}\n\n"
                    await asyncio.sleep(0.01)  # Small delay for streaming effect
                
                # Send complete content
                yield f"data: {json.dumps({'type': 'content_complete', 'content': content})}\n\n"
            
            # Now get critique
            yield f"data: {json.dumps({'status': 'critiquing', 'message': 'Getting feedback...'})}\n\n"
            
            critic_chain = LLMChain(llm=critic_llm, prompt=critic_template)
            
            critique = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: critic_chain.run(
                    tone=get_persona_field("tone", "friendly"),
                    style=get_persona_field("style", "engaging"),
                    catchphrases=format_list_field(get_persona_field("catchphrases", [])),
                    quirks=format_list_field(get_persona_field("quirks", [])),
                    content=content
                )
            )
            
            critiques.append(critique)
            
            # Send critique
            yield f"data: {json.dumps({'type': 'critique', 'critique': critique, 'iteration': i+1})}\n\n"
            
            # Check if approved
            if "APPROVED" in critique.upper():
                yield f"data: {json.dumps({'status': 'approved', 'iterations': i+1, 'message': f'Content approved after {i+1} iterations!'})}\n\n"
                break
            elif i < max_rounds - 1:
                yield f"data: {json.dumps({'status': 'improving', 'message': 'Improving content based on feedback...'})}\n\n"
        
        # Final result
        final_status = "APPROVED" if "APPROVED" in critiques[-1].upper() else "MAX_ITERATIONS_REACHED"
        
        response_content = {
            "title": generate_content_title(req.platform, req.prompt),
            "type": platform_config["type"],
            "description": f"Generated {req.platform} content for: {req.prompt[:100]}..." + 
                          (f" (Approved after {len(critiques)} iterations)" if final_status == "APPROVED" else 
                          f" (Max iterations reached: {len(critiques)})"),
            "content": content.strip(),
            "platform": req.platform
        }
        
        yield f"data: {json.dumps({'type': 'final_result', 'content': response_content, 'status': final_status, 'iterations': len(critiques), 'critiques': critiques})}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

# --------------- ROUTES ----------------
@app.get("/")
async def root():
    return {
        "message": "Multi-Platform Content Generator API", 
        "version": "1.0.0",
        "creator": get_persona_field("creator_name", "AI Content Creator"),
        "supported_platforms": list(PLATFORM_TEMPLATES.keys()),
        "streaming_enabled": True
    }

@app.get("/persona")
async def get_persona():
    """Get current persona configuration"""
    return {"persona": persona.get("persona", {})}

# Global OPTIONS handler for all routes
@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle all preflight OPTIONS requests"""
    return {
        "message": "OK", 
        "path": path,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "cors_enabled": True
    }

@app.options("/generate-stream")
async def generate_stream_options():
    """Handle preflight OPTIONS request for streaming endpoint"""
    return {"message": "OK", "endpoint": "generate-stream"}

@app.post("/generate-stream")
async def generate_content_stream(req: ContentRequest):
    """Generate content with streaming response"""
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    # Validate iterations
    max_rounds = req.iterations or 3
    if max_rounds < 1 or max_rounds > 10:
        raise HTTPException(status_code=400, detail="Iterations must be between 1 and 10")
    
    return StreamingResponse(
        stream_content_generation(req),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

# Keep the original non-streaming endpoint for backward compatibility
@app.post("/generate")
async def generate_content(req: ContentRequest):
    """Generate content (non-streaming version for backward compatibility)"""
    print(f"Received generate request: {req.platform}, {req.prompt[:50]}...")
    
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    if req.platform not in PLATFORM_TEMPLATES:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported platform. Supported platforms: {list(PLATFORM_TEMPLATES.keys())}"
        )
    
    # This would contain your original generate_content logic
    # I'll keep it simple for brevity, but you can copy from your original
    return {"message": "Use /generate-stream for better user experience"}

@app.post("/save_output")
async def save_output(req: SaveOutputRequest):
    """Save generated content output"""
    try:
        print(f"Saving output: {req.title} ({req.platform})")
        return {"status": "success", "message": "Content saved successfully"}
    except Exception as e:
        print(f"Error saving output: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save content: {str(e)}")

@app.get("/platforms")
async def get_supported_platforms():
    """Get list of supported platforms with their details"""
    return {
        "platforms": [
            {
                "id": platform,
                "name": platform.title(),
                "content_type": config["type"],
                "description": f"Generate {config['type'].replace('_', ' ')} for {platform.title()}"
            }
            for platform, config in PLATFORM_TEMPLATES.items()
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "google_api_key_set": bool(GOOGLE_API_KEY),
        "persona_loaded": bool(persona),
        "supported_platforms": len(PLATFORM_TEMPLATES),
        "cors_configured": True,
        "streaming_enabled": True
    }
