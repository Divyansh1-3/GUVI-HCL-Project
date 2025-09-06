import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const DocumentContext = createContext();

const initialState = {
  documents: [],
  loading: false,
  error: null
};

const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, loading: false, error: null };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'REMOVE_DOCUMENT':
      return { 
        ...state, 
        documents: state.documents.filter(doc => doc.id !== action.payload) 
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const fetchDocuments = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/documents');
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      dispatch({ type: 'SET_DOCUMENTS', payload: data.documents });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load documents');
    }
  };

  const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      
      // Add the new document to the list
      const newDocument = {
        id: result.document_id,
        filename: result.filename,
        file_type: file.type,
        file_size: file.size,
        upload_date: new Date().toISOString(),
        processed: 'completed'
      };
      
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
      return result;
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      const response = await fetch(`/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      dispatch({ type: 'REMOVE_DOCUMENT', payload: documentId });
    } catch (error) {
      toast.error('Failed to delete document');
      throw error;
    }
  };

  const getDocumentContent = async (documentId) => {
    try {
      const response = await fetch(`/documents/${documentId}/content`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document content');
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      toast.error('Failed to load document content');
      throw error;
    }
  };

  const refreshDocuments = () => {
    fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const value = {
    ...state,
    uploadDocument,
    deleteDocument,
    getDocumentContent,
    refreshDocuments,
    fetchDocuments
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
