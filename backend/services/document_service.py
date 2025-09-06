import os
import uuid
import asyncio
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from models.database import Document, get_db
from utils.file_processor import FileProcessor
from utils.vector_store_light import VectorStoreLight
import json
from datetime import datetime

class DocumentService:
    def __init__(self):
        self.file_processor = FileProcessor()
        self.vector_store = VectorStoreLight()
        self.upload_dir = os.getenv("UPLOAD_DIRECTORY", "./uploads")
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def initialize(self):
        """Initialize the document service"""
        await self.vector_store.initialize()
    
    async def upload_document(self, file) -> str:
        """Upload and process a document"""
        document_id = str(uuid.uuid4())
        
        try:
            # Save file to disk
            file_path = os.path.join(self.upload_dir, f"{document_id}_{file.filename}")
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Process document content
            content = await self.file_processor.process_file(file_path)
            
            # Store in database
            db = next(get_db())
            document = Document(
                id=document_id,
                filename=file.filename,
                file_type=file.content_type,
                file_size=len(content),
                processed="processing",
                content=content
            )
            db.add(document)
            db.commit()
            
            # Create embeddings and store in vector database
            await self.vector_store.add_document(document_id, content, file.filename)
            
            # Update document status
            document.processed = "completed"
            db.commit()
            db.close()
            
            return document_id
            
        except Exception as e:
            # Update document status to failed
            db = next(get_db())
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                document.processed = "failed"
                db.commit()
            db.close()
            raise e
    
    async def list_documents(self) -> List[Dict]:
        """List all uploaded documents"""
        db = next(get_db())
        documents = db.query(Document).all()
        db.close()
        
        return [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_type": doc.file_type,
                "file_size": doc.file_size,
                "upload_date": doc.upload_date.isoformat(),
                "processed": doc.processed
            }
            for doc in documents
        ]
    
    async def get_document_content(self, document_id: str) -> str:
        """Get the content of a specific document"""
        db = next(get_db())
        document = db.query(Document).filter(Document.id == document_id).first()
        db.close()
        
        if not document:
            raise ValueError("Document not found")
        
        return document.content
    
    async def delete_document(self, document_id: str):
        """Delete a document and its embeddings"""
        db = next(get_db())
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            db.close()
            raise ValueError("Document not found")
        
        # Remove from vector store
        await self.vector_store.delete_document(document_id)
        
        # Remove file from disk
        file_path = os.path.join(self.upload_dir, f"{document_id}_{document.filename}")
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Remove from database
        db.delete(document)
        db.commit()
        db.close()
    
    async def search_documents(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for relevant documents using vector similarity"""
        results = await self.vector_store.search(query, limit)
        return results
