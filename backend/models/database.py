from sqlalchemy import create_engine, Column, String, DateTime, Text, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./document_qa.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    file_size = Column(Integer)
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(String, default="pending")  # pending, processing, completed, failed
    content = Column(Text)
    document_metadata = Column(Text)  # JSON string for additional metadata

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    message_count = Column(Integer, default=0)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, index=True)
    message = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    message_type = Column(String, default="user")  # user, assistant
    confidence = Column(Float, default=0.0)

class QARecord(Base):
    __tablename__ = "qa_records"
    
    id = Column(String, primary_key=True, index=True)
    question = Column(Text)
    answer = Column(Text)
    document_id = Column(String, index=True)
    confidence = Column(Float)
    sources = Column(Text)  # JSON string of source documents
    timestamp = Column(DateTime, default=datetime.utcnow)

async def init_db():
    """Initialize the database"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
