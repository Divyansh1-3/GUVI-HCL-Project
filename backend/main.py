from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import uvicorn

from services.document_service import DocumentService
from services.qa_service import QAService
from services.chat_service import ChatService
from models.database import init_db
from utils.file_processor import FileProcessor

# Load environment variables
load_dotenv()

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and services on startup"""
    await init_db()
    await document_service.initialize()
    await qa_service.initialize()
    await chat_service.initialize()
    yield
    # Cleanup code here if needed

app = FastAPI(
    title="SolveX AI",
    description="A comprehensive system for document processing and Q&A with chat functionality",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_service = DocumentService()
qa_service = QAService()
chat_service = ChatService()
file_processor = FileProcessor()

# Request/Response models
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    message: str

class QAResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "SolveX AI API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "document_service": "active",
            "qa_service": "active",
            "chat_service": "active"
        }
    }

@app.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        # Validate file type
        if not file_processor.is_supported_file(file.filename):
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Process and store document
        document_id = await document_service.upload_document(file)
        
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            status="success",
            message="Document uploaded and processed successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        documents = await document_service.list_documents()
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.post("/qa", response_model=QAResponse)
async def ask_question(
    question: str = Form(...),
    document_id: Optional[str] = Form(None)
):
    """Ask a question about uploaded documents"""
    try:
        if document_id:
            # Question about specific document
            result = await qa_service.ask_document_question(question, document_id)
        else:
            # Question about all documents
            result = await qa_service.ask_general_question(question)
        
        return QAResponse(
            answer=result["answer"],
            sources=result["sources"],
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """General chat functionality"""
    try:
        response = await chat_service.process_message(
            chat_message.message, 
            chat_message.session_id
        )
        return ChatResponse(
            response=response["message"],
            session_id=response["session_id"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a specific document"""
    try:
        await document_service.delete_document(document_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

@app.get("/documents/{document_id}/content")
async def get_document_content(document_id: str):
    """Get the content of a specific document"""
    try:
        content = await document_service.get_document_content(document_id)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving document content: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
