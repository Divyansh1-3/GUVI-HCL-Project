import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict
import uuid
import openai

class VectorStoreLight:
    def __init__(self):
        self.persist_directory = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        self.client = None
        self.collection = None
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def initialize(self):
        """Initialize the vector store"""
        try:
            # Initialize ChromaDB client
            self.client = chromadb.PersistentClient(
                path=self.persist_directory,
                settings=Settings(
                    anonymized_telemetry=False,
                    allow_reset=True
                )
            )
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name="documents",
                metadata={"hnsw:space": "cosine"}
            )
            
        except Exception as e:
            raise Exception(f"Error initializing vector store: {str(e)}")
    
    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding using OpenAI API"""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            # Fallback to simple text representation
            return [float(ord(c)) for c in text[:100]]  # Simple fallback
    
    async def add_document(self, document_id: str, content: str, filename: str):
        """Add a document to the vector store"""
        try:
            # Split content into chunks
            chunks = self._split_text(content)
            
            # Generate embeddings and store
            for i, chunk in enumerate(chunks):
                chunk_id = f"{document_id}_{i}"
                embedding = self._get_embedding(chunk)
                
                self.collection.add(
                    documents=[chunk],
                    embeddings=[embedding],
                    metadatas=[{
                        "document_id": document_id,
                        "filename": filename,
                        "chunk_index": i
                    }],
                    ids=[chunk_id]
                )
            
            return True
            
        except Exception as e:
            raise Exception(f"Error adding document to vector store: {str(e)}")
    
    async def search_similar(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for similar documents"""
        try:
            query_embedding = self._get_embedding(query)
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=limit
            )
            
            similar_docs = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    similar_docs.append({
                        "content": doc,
                        "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                        "distance": results['distances'][0][i] if results['distances'] else 0
                    })
            
            return similar_docs
            
        except Exception as e:
            raise Exception(f"Error searching vector store: {str(e)}")
    
    def _split_text(self, text: str, chunk_size: int = 1000) -> List[str]:
        """Split text into chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    async def delete_document(self, document_id: str):
        """Delete a document from the vector store"""
        try:
            # Get all chunks for this document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
            
            return True
            
        except Exception as e:
            raise Exception(f"Error deleting document from vector store: {str(e)}")
