import pandas as pd
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()
def get_doc(file_path):
    df = pd.read_csv(file_path)
    docs = []

    for _, row in df.iterrows():
        content = f"""
TITLE: {row.get("title", "")}

TRANSCRIPT:
{row.get("transcript", "")}

DESCRIPTION:
{row.get("description", "")}
"""

        metadata = {
            "views": row.get("views", ""),
            "length_seconds": row.get("length", ""),
            "publish_date": row.get("publish_date", ""),
            "channel": row.get("channel_title", ""),
            "keywords": row.get("keywords", ""),
        }

        docs.append(Document(page_content=content.strip(), metadata=metadata))

    return docs


def ingest():
    file_path = "/Users/prathameshpatil/Cre8Hub-AI-Workflow/data/mrbeast.csv"
    docs = get_doc(file_path)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = FAISS.from_documents(docs, embeddings)
    db.save_local("mrbeast_faiss_index")

def get_vb():
    docs = get_doc("/Users/prathameshpatil/Cre8Hub-AI-Workflow/data/mrbeast.csv")

    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"}  # ✅ override MPS
    )
    faiss_index_path = "vectorDBs/mrbeast_faiss_index"
    if not os.path.exists(faiss_index_path):
        raise FileNotFoundError(f"FAISS index not found at {faiss_index_path}")
    vectorstore = FAISS.load_local(
        faiss_index_path, 
        embeddings=embeddings, 
        allow_dangerous_deserialization=True
    )
    return vectorstore


ingest()