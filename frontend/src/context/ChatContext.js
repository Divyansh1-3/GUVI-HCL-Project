import React, { createContext, useContext, useReducer } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const ChatContext = createContext();

const initialState = {
  messages: [],
  sessionId: null,
  loading: false,
  error: null
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, loading: false, error: null };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], sessionId: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (message) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: state.sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const result = await response.json();

      // Update session ID if it's new
      if (result.session_id && result.session_id !== state.sessionId) {
        dispatch({ type: 'SET_SESSION', payload: result.session_id });
      }

      // Add user message
      const userMessage = {
        id: Date.now(),
        message_type: 'user',
        message: message,
        response: '',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        message_type: 'assistant',
        message: '',
        response: result.response,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(`Chat failed: ${error.message}`);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    toast.success('Chat cleared');
  };

  const loadChatHistory = async (sessionId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(API_ENDPOINTS.CHAT_HISTORY(sessionId));

      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }

      const data = await response.json();
      dispatch({ type: 'SET_MESSAGES', payload: data.messages });
      dispatch({ type: 'SET_SESSION', payload: sessionId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load chat history');
    }
  };

  const exportChat = () => {
    const chatData = {
      sessionId: state.sessionId,
      messages: state.messages.map(msg => ({
        type: msg.message_type,
        content: msg.message_type === 'user' ? msg.message : msg.response,
        timestamp: msg.timestamp
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${state.sessionId || 'new'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Chat exported successfully!');
  };

  const value = {
    ...state,
    sendMessage,
    clearChat,
    loadChatHistory,
    exportChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
