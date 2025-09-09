import json, re
from typing import Any, Dict

def strip_code_fences(text: str) -> str:
    if not text:
        return ""
    text = text.strip()
    text = re.sub(r"^```json\s*|\s*```$", "", text, flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r"^```\s*|\s*```$", "", text, flags=re.IGNORECASE | re.MULTILINE)
    return text.strip()

def parse_json_strict(raw: str) -> Dict[str, Any]:
    cleaned = strip_code_fences(raw)
    return json.loads(cleaned)
