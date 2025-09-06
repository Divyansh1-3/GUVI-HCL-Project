// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Document endpoints
  DOCUMENTS: `${API_BASE_URL}/documents`,
  UPLOAD: `${API_BASE_URL}/upload`,
  DOCUMENT_CONTENT: (id) => `${API_BASE_URL}/documents/${id}/content`,
  DELETE_DOCUMENT: (id) => `${API_BASE_URL}/documents/${id}`,
  
  // Chat endpoints
  CHAT: `${API_BASE_URL}/chat`,
  CHAT_HISTORY: (sessionId) => `${API_BASE_URL}/chat/history/${sessionId}`,
  
  // Q&A endpoints
  QA: `${API_BASE_URL}/qa`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/`,
};

export default API_BASE_URL;
