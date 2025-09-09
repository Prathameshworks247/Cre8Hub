from typing import List, Optional
from pydantic import BaseModel, Field

class Persona(BaseModel):
    creator_name: Optional[str] = None
    tone: str
    style: str
    pacing: Optional[str] = None
    humor: Optional[str] = None
    catchphrases: List[str] = Field(default_factory=list)
    audience: Optional[str] = None
    signature_patterns: List[str] = Field(default_factory=list)

class PersonaExtractRequest(BaseModel):
    creator_content: str

class Critique(BaseModel):
    score: float = Field(ge=0, le=10)
    issues: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    partial_rewrite: str

class GenerateRequest(BaseModel):
    topic: str
    persona: Persona
    platform: Optional[str] = "youtube"
    words_min: int = 500
    words_max: int = 700
    max_iters: int = 3
    pass_score: float = 8.0

class GenerateResponse(BaseModel):
    final_script: str
    critic_history: List[Critique]
# --------------- MODELS ----------------
class ContentRequest(BaseModel):
    platform: str
    prompt: str
    personify: Optional[bool] = False
    iterations: Optional[int] = 3
    
    class Config:
        schema_extra = {
            "example": {
                "platform": "youtube",
                "prompt": "How to make the perfect cup of coffee at home",
                "personify": True,
                "iterations": 3
            }
        }

class SaveOutputRequest(BaseModel):
    title: str
    type: str
    description: Optional[str] = None
    content: str
    platform: str