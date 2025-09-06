import os
import openai
from typing import Dict, List
from services.document_service import DocumentService
from utils.vector_store import VectorStore
import json

class QAService:
    def __init__(self):
        self.document_service = DocumentService()
        self.vector_store = VectorStore()
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def initialize(self):
        """Initialize the QA service"""
        await self.vector_store.initialize()
    
    async def ask_document_question(self, question: str, document_id: str) -> Dict:
        """Ask a question about a specific document"""
        try:
            # Get document content
            document_content = await self.document_service.get_document_content(document_id)
            
            # Create context for the question
            context = f"Document Content:\n{document_content}\n\nQuestion: {question}"
            
            # Generate answer using OpenAI
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that answers questions based on the provided document content. Provide accurate, concise answers and cite relevant parts of the document when possible."
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            answer = response.choices[0].message.content
            confidence = 0.8  # Placeholder confidence score
            
            return {
                "answer": answer,
                "sources": [document_id],
                "confidence": confidence
            }
            
        except Exception as e:
            raise Exception(f"Error processing document question: {str(e)}")
    
    async def ask_general_question(self, question: str) -> Dict:
        """Ask a question about all uploaded documents"""
        try:
            # Search for relevant documents
            relevant_docs = await self.vector_store.search(question, limit=3)
            
            if not relevant_docs:
                return {
                    "answer": "I don't have enough information to answer your question. Please upload some documents first.",
                    "sources": [],
                    "confidence": 0.0
                }
            
            # Create context from relevant documents
            context_parts = []
            sources = []
            
            for doc in relevant_docs:
                context_parts.append(f"Document: {doc['filename']}\nContent: {doc['content'][:1000]}...")
                sources.append(doc['document_id'])
            
            context = "\n\n".join(context_parts)
            full_context = f"Context from relevant documents:\n{context}\n\nQuestion: {question}"
            
            # Generate answer using OpenAI
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that answers questions based on the provided document context. Provide accurate, concise answers and cite which documents you used for your answer."
                    },
                    {
                        "role": "user",
                        "content": full_context
                    }
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            answer = response.choices[0].message.content
            confidence = 0.7  # Placeholder confidence score
            
            return {
                "answer": answer,
                "sources": sources,
                "confidence": confidence
            }
            
        except Exception as e:
            raise Exception(f"Error processing general question: {str(e)}")
    
    async def get_related_questions(self, question: str) -> List[str]:
        """Generate related questions based on the input question"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Generate 3 related questions that someone might ask based on the given question. Return them as a JSON array of strings."
                    },
                    {
                        "role": "user",
                        "content": f"Original question: {question}"
                    }
                ],
                max_tokens=200,
                temperature=0.5
            )
            
            related_questions = json.loads(response.choices[0].message.content)
            return related_questions
            
        except Exception as e:
            return []
