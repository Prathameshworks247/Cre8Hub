from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import base64
import io
from PIL import Image, ImageDraw
import google.generativeai as genai
from dotenv import load_dotenv
import asyncio

load_dotenv()

# --------------- CONFIG ----------------
app = FastAPI(title="Cre8Canvas - AI Image Generator", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080", 
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY not set! Export it in your environment.")

# Configure Google AI
genai.configure(api_key=GOOGLE_API_KEY)
print(f"✅ Google AI configured with API key")

# --------------- MODELS ----------------
class TextToImageRequest(BaseModel):
    prompt: str
    generation_type: str  # "thumbnail", "advertisement", "poster"
    negative_prompt: Optional[str] = None
    num_images: Optional[int] = 1

class ImageToImageRequest(BaseModel):
    prompt: str
    generation_type: str
    base_image: str  # Base64 encoded
    reference_images: Optional[List[str]] = []
    negative_prompt: Optional[str] = None
    strength: Optional[float] = 0.75

class GenerationResponse(BaseModel):
    success: bool
    images: List[str]
    prompt_used: str
    generation_type: str
    message: Optional[str] = None

# --------------- HELPERS ----------------
DIMENSIONS = {
    "thumbnail": (1280, 720),
    "advertisement": (1200, 628),
    "poster": (1080, 1920)
}

ENHANCEMENTS = {
    "thumbnail": "Eye-catching YouTube thumbnail with bold visuals and high contrast. ",
    "advertisement": "Professional advertisement with clear messaging and striking design. ",
    "poster": "Stunning poster with dramatic composition and beautiful typography. "
}

def enhance_prompt(prompt: str, gen_type: str) -> str:
    """Add type-specific enhancements to prompt"""
    enhancement = ENHANCEMENTS.get(gen_type, "")
    return f"{enhancement}{prompt}. Professional quality, highly detailed, sharp focus."

def decode_image(b64_string: str) -> Image.Image:
    """Decode base64 to PIL Image"""
    if "," in b64_string:
        b64_string = b64_string.split(",")[1]
    return Image.open(io.BytesIO(base64.b64decode(b64_string)))

def encode_image(image: Image.Image) -> str:
    """Encode PIL Image to base64"""
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"

def create_error_placeholder(width: int, height: int, error_msg: str) -> str:
    """Create an error placeholder image"""
    img = Image.new('RGB', (width, height), color=(30, 41, 59))
    draw = ImageDraw.Draw(img)
    
    lines = [
        "⚠️ Generation Error",
        "",
        f"{error_msg[:60]}",
        "",
        "This may be due to:",
        "• Rate limits (wait 5 min)",
        "• Model availability",
        "• API quota exhausted"
    ]
    
    y = height // 3
    for line in lines:
        bbox = draw.textbbox((0, 0), line)
        x = max((width - (bbox[2] - bbox[0])) // 2, 10)
        draw.text((x, y), line, fill=(248, 113, 113))
        y += 35
    
    return encode_image(img)

# --------------- GENERATION FUNCTIONS ----------------
async def generate_images_from_text(
    prompt: str, 
    generation_type: str, 
    num_images: int = 1
) -> tuple[List[str], str]:
    """
    Generate images using Gemini 2.5 Flash Image Preview
    Simple, direct, no Vertex AI needed!
    """
    
    # Rate limit handling
    max_retries = 5
    base_delay = 15  # seconds
    
    # Get dimensions
    width, height = DIMENSIONS.get(generation_type, (1024, 1024))
    
    # Enhance prompt
    enhanced = enhance_prompt(prompt, generation_type)
    
    for attempt in range(max_retries):
        try:
            print(f"🎨 Attempt {attempt + 1}/{max_retries} - Generating {num_images} image(s)...")
            
            # Initialize the image generation model
            model = genai.GenerativeModel('gemini-2.5-flash-image')
            
            images = []
            
            for i in range(num_images):
                # Add delay between images to avoid rate limits
                if i > 0:
                    print(f"⏳ Waiting 8 seconds before next image...")
                    await asyncio.sleep(8)
                
                print(f"  → Generating image {i+1}/{num_images}...")
                
                try:
                    # Generate!
                    response = model.generate_content(enhanced)
                    
                    # Extract image data
                    image_found = False
                    print(f"  🔍 Checking response for image data...")
                    print(f"  Has parts: {hasattr(response, 'parts')}")
                    
                    if hasattr(response, 'parts'):
                        print(f"  Number of parts: {len(response.parts)}")
                        for idx, part in enumerate(response.parts):
                            print(f"  Part {idx}: has inline_data = {hasattr(part, 'inline_data')}, has text = {hasattr(part, 'text')}")
                            
                            # Check if this part has text (might be an error or explanation)
                            if hasattr(part, 'text'):
                                print(f"     Text content: {part.text[:200]}")
                            
                            if hasattr(part, 'inline_data'):
                                data = part.inline_data.data
                                mime = part.inline_data.mime_type
                                
                                print(f"  📊 Inline data details (Part {idx}):")
                                print(f"     • Data type: {type(data)}")
                                print(f"     • Data length: {len(data) if data else 0} bytes")
                                print(f"     • MIME type: '{mime}'")
                                
                                # Skip if empty
                                if not data or len(data) == 0:
                                    print(f"     ⚠️  Part {idx} is empty, checking next part...")
                                    continue
                                
                                # Convert to base64 if needed
                                if isinstance(data, bytes):
                                    data = base64.b64encode(data).decode()
                                    print(f"     • Base64 length: {len(data)}")
                                
                                images.append(f"data:{mime};base64,{data}")
                                print(f"  ✅ Image {i+1} generated! Final size: {len(f'data:{mime};base64,{data}')}")
                                image_found = True
                                break
                    else:
                        print(f"  ⚠️  Response has no parts attribute!")
                    
                    if not image_found:
                        raise Exception("No image in response")
                        
                except Exception as img_error:
                    print(f"  ❌ Failed: {img_error}")
                    # Add placeholder for failed image
                    images.append(create_error_placeholder(width, height, str(img_error)))
            
            return images, enhanced
            
        except Exception as e:
            error_msg = str(e)
            
            # Check for rate limit
            is_rate_limit = any(x in error_msg.lower() for x in ['429', 'rate', 'quota', 'exhausted'])
            
            if is_rate_limit and attempt < max_retries - 1:
                wait = base_delay * (2 ** attempt)  # Exponential backoff
                print(f"⚠️  Rate limit hit! Waiting {wait}s before retry...")
                await asyncio.sleep(wait)
                continue
            else:
                # Out of retries or non-rate-limit error
                if is_rate_limit:
                    raise Exception(f"Rate limit exceeded. Please wait 5 minutes and try again.")
                else:
                    raise Exception(f"Generation failed: {error_msg}")
    
    raise Exception("Failed after all retries")


async def generate_images_from_image(
    prompt: str,
    generation_type: str,
    base_image: str,
    reference_images: List[str] = None,
    strength: float = 0.75
) -> tuple[List[str], str]:
    """
    Transform an image using Gemini 2.5 Flash Image (proper image editing)
    According to: https://ai.google.dev/gemini-api/docs/image-generation#python_1
    """
    
    max_retries = 5
    base_delay = 15
    
    width, height = DIMENSIONS.get(generation_type, (1024, 1024))
    
    for attempt in range(max_retries):
        try:
            # Decode the base image
            img = decode_image(base_image)
            img = img.resize((width, height), Image.Resampling.LANCZOS)
            
            # Convert to bytes for Gemini
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            img_bytes = img_bytes.getvalue()
            
            # Enhance the prompt for the specific generation type
            enhanced_prompt = enhance_prompt(prompt, generation_type)
            
            # Build content list with prompt and images
            content_parts = [enhanced_prompt]
            
            # Add base image
            content_parts.append({"mime_type": "image/png", "data": img_bytes})
            
            # Add reference images if provided (for composition/style transfer)
            if reference_images and len(reference_images) > 0:
                print(f"🎨 Using {len(reference_images)} reference image(s) for composition/style transfer...")
                for idx, ref_img_b64 in enumerate(reference_images[:3]):  # Limit to 3 reference images
                    try:
                        ref_img = decode_image(ref_img_b64)
                        ref_img = ref_img.resize((width, height), Image.Resampling.LANCZOS)
                        
                        ref_bytes = io.BytesIO()
                        ref_img.save(ref_bytes, format='PNG')
                        
                        content_parts.append({"mime_type": "image/png", "data": ref_bytes.getvalue()})
                        print(f"   ✅ Reference image {idx + 1} added")
                    except Exception as e:
                        print(f"   ⚠️  Failed to process reference image {idx + 1}: {e}")
            
            # Update prompt based on number of images
            if reference_images and len(reference_images) > 0:
                full_prompt = f"{enhanced_prompt} Using the provided images, {prompt}"
            else:
                full_prompt = f"{enhanced_prompt} Based on the provided image, {prompt}"
            
            # Update the first part with the final prompt
            content_parts[0] = full_prompt
            
            print(f"🔄 Transforming with Gemini 2.5 Flash Image...")
            print(f"   Total inputs: 1 prompt + {len(content_parts) - 1} image(s)")
            print(f"   Prompt: {full_prompt[:100]}...")
            
            # Initialize the image generation model
            image_model = genai.GenerativeModel('gemini-2.5-flash-image')
            
            # Pass prompt and ALL images to the model
            # Supports: single image edit, multi-image composition, style transfer
            response = image_model.generate_content(content_parts)
            
            # Extract generated image
            image_found = False
            print(f"  🔍 Checking response for transformed image...")
            
            if hasattr(response, 'parts'):
                print(f"  Number of parts: {len(response.parts)}")
                for idx, part in enumerate(response.parts):
                    print(f"  Part {idx}: has inline_data = {hasattr(part, 'inline_data')}, has text = {hasattr(part, 'text')}")
                    
                    # Check if this part has text
                    if hasattr(part, 'text'):
                        print(f"     Text content: {part.text[:200]}")
                    
                    if hasattr(part, 'inline_data'):
                        data = part.inline_data.data
                        mime = part.inline_data.mime_type
                        
                        print(f"  📊 Inline data details (Part {idx}):")
                        print(f"     • Data type: {type(data)}")
                        print(f"     • Data length: {len(data) if data else 0} bytes")
                        print(f"     • MIME type: '{mime}'")
                        
                        # Skip if empty
                        if not data or len(data) == 0:
                            print(f"     ⚠️  Part {idx} is empty, checking next part...")
                            continue
                        
                        if isinstance(data, bytes):
                            data = base64.b64encode(data).decode()
                            print(f"     • Base64 length: {len(data)}")
                        
                        print(f"  ✅ Image transformed! Final size: {len(f'data:{mime};base64,{data}')}")
                        return [f"data:{mime};base64,{data}"], full_prompt
            
            # Fallback: return enhanced original
            print("⚠️  No transformation found, returning enhanced original")
            return [encode_image(img)], full_prompt
            
        except Exception as e:
            error_msg = str(e)
            is_rate_limit = any(x in error_msg.lower() for x in ['429', 'rate', 'quota', 'exhausted'])
            
            if is_rate_limit and attempt < max_retries - 1:
                wait = base_delay * (2 ** attempt)
                print(f"⚠️  Rate limit! Waiting {wait}s...")
                await asyncio.sleep(wait)
                continue
            else:
                if is_rate_limit:
                    raise Exception("Rate limit exceeded. Wait 5 minutes and try again.")
                else:
                    raise Exception(f"Transformation failed: {error_msg}")
    
    raise Exception("Failed after all retries")


# --------------- ROUTES ----------------
@app.get("/")
async def root():
    return {
        "service": "Cre8Canvas AI Image Generator",
        "version": "2.0.0",
        "model": "gemini-2.5-flash-image",
        "types": ["thumbnail", "advertisement", "poster"]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "api_configured": bool(GOOGLE_API_KEY),
        "model": "gemini-2.5-flash-image",
        "note": "No Vertex AI needed - using Google AI Studio API"
    }

@app.post("/generate/text-to-image", response_model=GenerationResponse)
async def text_to_image_endpoint(request: TextToImageRequest):
    """Generate images from text"""
    try:
        if not request.prompt.strip():
            raise HTTPException(400, "Prompt required")
        
        if request.generation_type not in DIMENSIONS:
            raise HTTPException(400, f"Invalid type. Use: {list(DIMENSIONS.keys())}")
        
        images, prompt_used = await generate_images_from_text(
            request.prompt,
            request.generation_type,
            request.num_images or 1
        )
        
        return GenerationResponse(
            success=True,
            images=images,
            prompt_used=prompt_used,
            generation_type=request.generation_type,
            message=f"Generated {len(images)} image(s)"
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(500, str(e))


@app.post("/generate/image-to-image", response_model=GenerationResponse)
async def image_to_image_endpoint(request: ImageToImageRequest):
    """Transform images"""
    try:
        if not request.prompt.strip():
            raise HTTPException(400, "Prompt required")
        
        if not request.base_image:
            raise HTTPException(400, "Base image required")
        
        if request.generation_type not in DIMENSIONS:
            raise HTTPException(400, f"Invalid type. Use: {list(DIMENSIONS.keys())}")
        
        images, prompt_used = await generate_images_from_image(
            request.prompt,
            request.generation_type,
            request.base_image,
            request.reference_images or [],
            request.strength or 0.75
        )
        
        return GenerationResponse(
            success=True,
            images=images,
            prompt_used=prompt_used,
            generation_type=request.generation_type,
            message="Image transformed"
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(500, str(e))


@app.get("/types")
async def get_types():
    """Get generation types"""
    return {
        "types": [
            {
                "id": "thumbnail",
                "name": "YouTube Thumbnail",
                "dimensions": "1280×720",
                "aspect": "16:9"
            },
            {
                "id": "advertisement",
                "name": "Advertisement",
                "dimensions": "1200×628",
                "aspect": "Social media optimized"
            },
            {
                "id": "poster",
                "name": "Poster",
                "dimensions": "1080×1920",
                "aspect": "9:16 (vertical)"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Cre8Canvas Server...")
    print("📍 http://localhost:7001")
    print("🎨 Using: Gemini 2.5 Flash Image Preview")
    print("💡 No Vertex AI needed!")
    uvicorn.run(app, host="0.0.0.0", port=7001)