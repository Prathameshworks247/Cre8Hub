from langchain_community.llms import Ollama

def get_llm(model_name="gemma3:4b"):
    return Ollama(model=model_name)