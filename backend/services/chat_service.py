import os
import uuid
import openai
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
\

from models.database import ChatSession, ChatMessage, get_db
from datetime import datetime, timedelta
import json

class ChatService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.max_session_age = timedelta(hours=24)
    
    async def initialize(self):
        """Initialize the chat service"""
        pass
    
    async def process_message(self, message: str, session_id: Optional[str] = None) -> Dict:
        """Process a chat message and return response"""
        try:
            # Get or create session
            if not session_id:
                session_id = await self._create_session()
            else:
                await self._update_session_activity(session_id)
            
            # Get conversation history
            history = await self._get_conversation_history(session_id)
            
            # Generate response using OpenAI
            response = await self._generate_response(message, history)
            
            # Save message and response to database
            await self._save_message(session_id, message, response, "user")
            await self._save_message(session_id, response, "", "assistant")
            
            return {
                "message": response,
                "session_id": session_id
            }
            
        except Exception as e:
            raise Exception(f"Error processing chat message: {str(e)}")
    
    async def _create_session(self) -> str:
        """Create a new chat session"""
        session_id = str(uuid.uuid4())
        db = next(get_db())
        
        session = ChatSession(
            id=session_id,
            created_at=datetime.utcnow(),
            last_activity=datetime.utcnow()
        )
        
        db.add(session)
        db.commit()
        db.close()
        
        return session_id
    
    async def _update_session_activity(self, session_id: str):
        """Update session last activity"""
        db = next(get_db())
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        
        if session:
            session.last_activity = datetime.utcnow()
            session.message_count += 1
            db.commit()
        
        db.close()
    
    async def _get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        """Get conversation history for a session"""
        db = next(get_db())
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.timestamp.desc()).limit(limit).all()
        
        db.close()
        
        # Convert to OpenAI format and reverse order
        history = []
        for msg in reversed(messages):
            history.append({
                "role": msg.message_type,
                "content": msg.message if msg.message_type == "user" else msg.response
            })
        
        return history
    
    async def _generate_response(self, message: str, history: List[Dict]) -> str:
        """Generate response using OpenAI"""
        try:
            # Prepare messages for OpenAI
            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant. You can help with general questions, provide information, and assist with various tasks. Be friendly, informative, and concise in your responses."
                }
            ]
            
            # Add conversation history
            messages.extend(history)
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })
            
            # Generate response
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later."
    
    async def _save_message(self, session_id: str, message: str, response: str, message_type: str):
        """Save message to database"""
        db = next(get_db())
        
        chat_message = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            message=message,
            response=response,
            message_type=message_type,
            timestamp=datetime.utcnow()
        )
        
        db.add(chat_message)
        db.commit()
        db.close()
    
    async def get_session_history(self, session_id: str) -> List[Dict]:
        """Get full conversation history for a session"""
        db = next(get_db())
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.timestamp.asc()).all()
        
        db.close()
        
        return [
            {
                "id": msg.id,
                "message": msg.message,
                "response": msg.response,
                "message_type": msg.message_type,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in messages
        ]
    
    async def cleanup_old_sessions(self):
        """Clean up old chat sessions"""
        cutoff_time = datetime.utcnow() - self.max_session_age
        db = next(get_db())
        
        # Delete old sessions and their messages
        old_sessions = db.query(ChatSession).filter(
            ChatSession.last_activity < cutoff_time
        ).all()
        
        for session in old_sessions:
            # Delete messages
            db.query(ChatMessage).filter(
                ChatMessage.session_id == session.id
            ).delete()
            
            # Delete session
            db.delete(session)
        
        db.commit()
        db.close()
