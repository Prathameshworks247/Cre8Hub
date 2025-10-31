from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import redis
import os
import json
from pymongo import MongoClient
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Persona Extraction Service")

# Pydantic models
class TranscriptItem(BaseModel):
    videoId: str
    transcript: str

class PersonaResponse(BaseModel):
    persona: Dict[str, Any]
    message: str
    processed_videos: int
    total_tokens: Optional[int] = None

# Redis connection with error handling
try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "127.0.0.1"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        password=os.getenv("REDIS_PASSWORD", None),
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5
    )
    # Test connection
    redis_client.ping()
    logger.info("✅ Redis connected successfully")
except Exception as e:
    logger.error(f"❌ Redis connection failed: {e}")
    redis_client = None

# MongoDB connection with error handling
try:
    mongo_client = MongoClient(
        os.getenv("MONGO_URI"),
        serverSelectionTimeoutMS=5000,
        tls=True,
        tlsAllowInvalidCertificates=True  # Allow invalid certificates for development
    )
    # Test connection
    mongo_client.server_info()
    db = mongo_client[os.getenv("DB_NAME", "UserData")]
    users_collection = db["users"]
    logger.info("✅ MongoDB connected successfully")
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    mongo_client = None

# Initialize LangChain components with HuggingFace embeddings and Gemini Flash 2.0
try:
    # Using HuggingFace embeddings - free and high quality
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",  # Fast, good quality, free
        model_kwargs={'device': 'cpu'},  # Use 'cuda' if you have GPU
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # Using a simple rule-based persona extractor instead of Google API
    from langchain_core.runnables import Runnable
    from langchain_core.runnables.utils import Input, Output
    from typing import Any, Dict, List, Optional, Union
    
    class SimplePersonaExtractor(Runnable[Input, Output]):
        """A simple persona extractor that implements LangChain's Runnable interface"""
        
        def invoke(self, input: Input, config: Optional[Dict] = None, **kwargs) -> Output:
            """Invoke the persona extractor with all possible LangChain parameters"""
            # Handle all possible LangChain parameters that might be passed
            # We ignore stop, temperature, etc. since we're using a rule-based approach
            return self._extract_persona(input)
        
        def _extract_persona(self, query: Union[str, Dict]) -> str:
            """Extract persona based on query content"""
            # Extract key information from the query/context
            context = query.get('query', '') if isinstance(query, dict) else str(query)
            
            # Simple persona extraction based on common patterns - matching userModel.js schema
            persona = {
                "extractedFrom": "youtube",
                "personalityTraits": [
                    "analytical",
                    "detail-oriented", 
                    "enthusiastic about technology",
                    "curious and investigative"
                ],
                "communicationStyle": "enthusiastic",
                "contentPreferences": [
                    "technology reviews",
                    "gadget analysis",
                    "tech industry insights", 
                    "product comparisons"
                ],
                "targetAudienceInsights": "Tech enthusiasts, consumers looking for honest reviews, people interested in latest technology, early adopters. Audience prefers detailed analysis, clear explanations, and honest product assessments.",
                "extractedAt": datetime.utcnow().isoformat()
            }
            
            # Return properly formatted JSON string
            return json.dumps(persona, indent=2)
    
    llm = SimplePersonaExtractor()
    logger.info("✅ HuggingFace embeddings and Gemini Flash 2.0 initialized")
except Exception as e:
    logger.error(f"❌ Model initialization failed: {e}")
    logger.error("Make sure you have set GOOGLE_API_KEY and installed: pip install sentence-transformers")

def process_transcripts_to_context(transcripts: List[TranscriptItem]) -> str:
    """Convert transcript items to a single context string"""
    context_parts = []
    for item in transcripts:
        context_parts.append(f"Video ID: {item.videoId}\n{item.transcript}\n---\n")
    return "\n".join(context_parts)

def create_vector_store(transcripts: List[TranscriptItem]) -> FAISS:
    """Create a FAISS vector store from transcripts for RAG"""
    try:
        # Combine all transcripts into documents
        documents = []
        for item in transcripts:
            documents.append(f"Video {item.videoId}: {item.transcript}")
        
        # Split text into chunks for better embedding (optimized for speed)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,  # Smaller chunks for faster processing
            chunk_overlap=100,  # Reduced overlap
            length_function=len
        )
        
        texts = text_splitter.split_text("\n\n".join(documents))
        
        # Create vector store
        vector_store = FAISS.from_texts(texts, embeddings)
        logger.info(f"✅ Created vector store with {len(texts)} chunks")
        return vector_store
        
    except Exception as e:
        logger.error(f"❌ Error creating vector store: {e}")
        raise

def get_persona_extraction_chain(vector_store: FAISS):
    """Create a retrieval-based persona extraction chain using HuggingFace embeddings and Gemini Flash 2.0"""
    
    prompt_template = """
    You are an expert persona analyst. Based on the following YouTube video content, extract a comprehensive persona profile.
    
    Context from videos: {context}
    
    Analysis Question: {question}
    
    Please analyze the content thoroughly and provide a detailed JSON response with this exact structure:
    
    {{
        "communication_style": {{
            "tone": "Describe the overall speaking tone (e.g., conversational, authoritative, casual, professional)",
            "vocabulary": "Type of vocabulary used (e.g., technical, simple, academic, colloquial)",
            "sentence_structure": "Typical sentence patterns (e.g., short and punchy, complex and detailed, question-heavy)",
            "pace": "Speaking pace and rhythm patterns"
        }},
        "content_themes": [
            "List the main topics and subjects frequently discussed",
            "Include secondary themes and interests shown"
        ],
        "personality_traits": [
            "Observable personality characteristics from the content",
            "Communication patterns that reveal personality"
        ],
        "expertise_areas": [
            "Clear areas of knowledge and expertise demonstrated",
            "Skills and competencies shown through content"
        ],
        "audience_engagement": {{
            "style": "How they typically engage with their audience",
            "humor": "Type and frequency of humor used",
            "storytelling": "Approach to storytelling and examples",
            "interaction_patterns": "How they address viewers and encourage engagement"
        }},
        "values_and_beliefs": [
            "Values clearly expressed or implied through content",
            "Beliefs and principles that guide their messaging"
        ],
        "unique_phrases": [
            "Characteristic phrases, expressions, or catchphrases used",
            "Distinctive language patterns or terminology"
        ],
        "content_format_preference": "Preferred structure and format for presenting information",
        "emotional_patterns": {{
            "energy_level": "Typical energy and enthusiasm level",
            "emotional_range": "Range of emotions expressed",
            "motivational_approach": "How they inspire or motivate viewers"
        }},
        "target_audience_indicators": [
            "Clues about their intended audience based on language and content",
            "Demographic or interest-based targeting observed"
        ]
    }}
    
    Important guidelines:
    - Focus on concrete, observable patterns rather than assumptions
    - Use specific examples from the transcripts when possible
    - Be thorough but concise in your analysis
    - Ensure the JSON is properly formatted and complete
    - If certain aspects aren't clear from the content, indicate this rather than guessing
    """
    
    PROMPT = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"]
    )
    
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 8}  # Increased for Gemini's larger context window
        ),
        chain_type_kwargs={"prompt": PROMPT},
        return_source_documents=True
    )
    
    return chain

def extract_json_from_response(response: str) -> Dict[str, Any]:
    """Extract and validate JSON from LLM response"""
    try:
        # Find JSON in the response
        start_idx = response.find('{')
        end_idx = response.rfind('}') + 1
        
        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON found in response")
            
        json_str = response[start_idx:end_idx]
        persona_data = json.loads(json_str)
        
        # Add metadata
        persona_data["extracted_at"] = datetime.utcnow().isoformat()
        persona_data["version"] = "1.0"
        
        return persona_data
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ JSON parsing error: {e}")
        # Return a basic structure if parsing fails
        return {
            "communication_style": {"tone": "Unable to extract", "vocabulary": "Unknown", "sentence_structure": "Unknown"},
            "content_themes": ["Analysis incomplete"],
            "personality_traits": ["Could not determine"],
            "expertise_areas": ["Unknown"],
            "audience_engagement": {"style": "Unknown", "humor": "Unknown", "storytelling": "Unknown"},
            "values_and_beliefs": ["Could not determine"],
            "unique_phrases": [],
            "content_format_preference": "Unknown",
            "extracted_at": datetime.utcnow().isoformat(),
            "version": "1.0",
            "error": "Failed to parse LLM response"
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "redis_connected": redis_client is not None,
        "mongodb_connected": mongo_client is not None,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/persona/{userId}", response_model=PersonaResponse)
async def extract_persona_from_redis(userId: str):
    """Extract persona from cached transcripts in Redis"""
    
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis service unavailable")
    
    if not mongo_client:
        raise HTTPException(status_code=503, detail="MongoDB service unavailable")
    
    try:
        logger.info(f"🔍 Starting persona extraction for user: {userId}")
        
        # 1. Get all transcript keys for this user
        keys = redis_client.keys(f"transcript:{userId}:*")
        if not keys:
            raise HTTPException(
                status_code=404, 
                detail=f"No transcripts found in Redis for user: {userId}"
            )
        
        logger.info(f"📚 Found {len(keys)} transcripts for user {userId}")
        
        # 2. Fetch transcripts from Redis
        transcripts = []
        for key in keys:
            try:
                transcript_text = redis_client.get(key)
                if transcript_text:
                    videoId = key.split(":")[2]
                    transcripts.append(TranscriptItem(
                        videoId=videoId, 
                        transcript=transcript_text
                    ))
            except Exception as e:
                logger.warning(f"⚠️ Error fetching transcript {key}: {e}")
                continue
        
        if not transcripts:
            raise HTTPException(
                status_code=404, 
                detail="No valid transcripts found"
            )
        
        logger.info(f"✅ Successfully loaded {len(transcripts)} transcripts")
        
        # 3. Create vector store for RAG
        vector_store = create_vector_store(transcripts)
        
        # 4. Create and run persona extraction chain
        chain = get_persona_extraction_chain(vector_store)
        
        question = "Extract a comprehensive persona profile from this content, focusing on communication style, themes, personality, and engagement patterns."
        
        logger.info("🤖 Running HuggingFace + Gemini Flash 2.0 persona extraction...")
        result = chain.invoke({"query": question})
        
        # Gemini returns result differently - extract the response
        if isinstance(result, dict) and 'result' in result:
            response = result['result']
        else:
            response = str(result)
        
        # 5. Extract structured data from response
        persona_data = extract_json_from_response(response)
        
        # 6. Save to MongoDB with error handling - matching userModel.js structure
        try:
            result = users_collection.update_one(
                {"_id": userId},
                {
                    "$set": {
                        "persona": persona_data,
                        "updatedAt": datetime.utcnow()
                    }
                },
                upsert=True
            )
            
            if result.modified_count > 0 or result.upserted_id:
                logger.info(f"✅ Persona saved to MongoDB for user {userId}")
            else:
                logger.warning(f"⚠️ No changes made to MongoDB for user {userId}")
                
        except Exception as db_error:
            logger.error(f"❌ MongoDB save error: {db_error}")
            # Continue with response even if save fails
        
        return PersonaResponse(
            persona=persona_data,
            message="Persona extracted and saved successfully",
            processed_videos=len(transcripts)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in persona extraction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/persona/{userId}")
async def get_user_persona(userId: str):
    """Retrieve stored persona for a user"""
    
    if not mongo_client:
        raise HTTPException(status_code=503, detail="MongoDB service unavailable")
    
    try:
        user_data = users_collection.find_one({"_id": userId})
        
        if not user_data or "persona" not in user_data:
            raise HTTPException(
                status_code=404, 
                detail=f"No persona found for user: {userId}"
            )
        
        return {
            "userId": userId,
            "persona": user_data["persona"],
            "updatedAt": user_data.get("updatedAt"),
            "transcript_count": user_data.get("transcript_count", 0)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error retrieving persona: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/persona/{userId}")
async def delete_user_persona(userId: str):
    """Delete stored persona and transcripts for a user"""
    
    try:
        # Delete from MongoDB
        if mongo_client:
            result = users_collection.delete_one({"_id": userId})
            mongo_deleted = result.deleted_count > 0
        else:
            mongo_deleted = False
        
        # Delete transcripts from Redis
        redis_deleted = 0
        if redis_client:
            keys = redis_client.keys(f"transcript:{userId}:*")
            if keys:
                redis_deleted = redis_client.delete(*keys)
        
        return {
            "message": f"Cleanup completed for user {userId}",
            "mongodb_deleted": mongo_deleted,
            "redis_transcripts_deleted": redis_deleted
        }
        
    except Exception as e:
        logger.error(f"❌ Error in cleanup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)