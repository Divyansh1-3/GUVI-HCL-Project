import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict
import uuid
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self):
        self.persist_directory = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        self.client = None
        self.collection = None
        self.embedding_model = None
    
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
            
            # Initialize embedding model
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
        except Exception as e:
            raise Exception(f"Error initializing vector store: {str(e)}")
    
    async def add_document(self, document_id: str, content: str, filename: str):
        """Add a document to the vector store"""
        try:
            # Split content into chunks
            chunks = self._split_text(content)
            
            # Generate embeddings and store
            for i, chunk in enumerate(chunks):
                chunk_id = f"{document_id}_{i}"
                
                self.collection.add(
                    documents=[chunk],
                    metadatas=[{
                        "document_id": document_id,
                        "filename": filename,
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }],
                    ids=[chunk_id]
                )
                
        except Exception as e:
            raise Exception(f"Error adding document to vector store: {str(e)}")
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for relevant documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit
            )
            
            # Process results
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    metadata = results['metadatas'][0][i]
                    distance = results['distances'][0][i] if results['distances'] else 0
                    
                    documents.append({
                        "document_id": metadata['document_id'],
                        "filename": metadata['filename'],
                        "content": doc,
                        "chunk_index": metadata['chunk_index'],
                        "similarity": 1 - distance,  # Convert distance to similarity
                        "total_chunks": metadata['total_chunks']
                    })
            
            return documents
            
        except Exception as e:
            raise Exception(f"Error searching vector store: {str(e)}")
    
    async def delete_document(self, document_id: str):
        """Delete a document from the vector store"""
        try:
            # Find all chunks for this document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                
        except Exception as e:
            raise Exception(f"Error deleting document from vector store: {str(e)}")
    
    def _split_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings
                for i in range(end, max(start + chunk_size - 100, start), -1):
                    if text[i] in '.!?':
                        end = i + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            
        return chunks
    
    async def get_collection_stats(self) -> Dict:
        """Get statistics about the collection"""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": "documents"
            }
        except Exception as e:
            return {"error": str(e)}
