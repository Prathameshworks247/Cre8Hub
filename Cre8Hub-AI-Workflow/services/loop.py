from typing import Dict, Any, List, Tuple
from pydantic import ValidationError

from services.chain import Persona, Critique, GenerateRequest
from services.chain import generator_chain, critic_chain
from utils.utils import parse_json_strict

def build_generator_inputs(req: GenerateRequest) -> Dict[str, Any]:
    p = req.persona
    return {
        "topic": req.topic,
        "platform": req.platform,
        "tone": p.tone,
        "style": p.style,
        "pacing": p.pacing or "unspecified",
        "humor": p.humor or "unspecified",
        "audience": p.audience or "unspecified",
        "catchphrases": ", ".join(p.catchphrases) if p.catchphrases else "none",
        "signature_patterns": ", ".join(p.signature_patterns) if p.signature_patterns else "none",
        "words_min": req.words_min,
        "words_max": req.words_max,
    }

def build_critic_inputs(script: str, persona: Persona) -> Dict[str, Any]:
    return {
        "tone": persona.tone,
        "style": persona.style,
        "pacing": persona.pacing or "unspecified",
        "humor": persona.humor or "unspecified",
        "audience": persona.audience or "unspecified",
        "catchphrases": ", ".join(persona.catchphrases) if persona.catchphrases else "none",
        "signature_patterns": ", ".join(persona.signature_patterns) if persona.signature_patterns else "none",
        "script": script,
    }

def refine_once(script: str, persona: Persona) -> Tuple[Critique, str]:
    raw = critic_chain.run(build_critic_inputs(script, persona))
    data = parse_json_strict(raw)
    critique = Critique(**data)
    improved = critique.partial_rewrite.strip() if critique.partial_rewrite.strip() else script
    return critique, improved

def run_refinement(req: GenerateRequest) -> Dict[str, Any]:
    # First draft
    draft = generator_chain.run(build_generator_inputs(req))

    best = draft
    history: List[Critique] = []

    for _ in range(req.max_iters):
        critique, improved = refine_once(best, req.persona)
        history.append(critique)

        best = improved
        if critique.score >= req.pass_score:
            break

        # Steer next pass with targeted improvements
        steering_prompt = (
            f"Refine this draft based on these improvements ONLY; keep strong parts.\n"
            f"Improvements: {', '.join(critique.improvements)}\n\n"
            f"DRAFT:\n{best}"
        )
        # Use generator directly with a minimal ad-hoc prompt
        best = generator_chain.llm.invoke(steering_prompt).content

    return {
        "final_script": best,
        "critic_history": [c.model_dump() for c in history],
    }
