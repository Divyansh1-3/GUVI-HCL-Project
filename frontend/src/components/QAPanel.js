import {
  AlertCircle,
  CheckCircle,
  FileText,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Send
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDocument } from '../context/DocumentContext';
import { API_ENDPOINTS } from '../config/api';

const QAPanel = () => {
  const { documents } = useDocument();
  const [question, setQuestion] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('question', question);
      if (selectedDocument) {
        formData.append('document_id', selectedDocument);
      }

      const response = await fetch(API_ENDPOINTS.QA, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const result = await response.json();
      setAnswer(result.answer);
      setSources(result.sources);
      setConfidence(result.confidence);

      // Add to history
      const newQa = {
        id: Date.now(),
        question,
        answer: result.answer,
        sources: result.sources,
        confidence: result.confidence,
        documentId: selectedDocument,
        timestamp: new Date().toISOString()
      };
      setQaHistory(prev => [newQa, ...prev]);

      toast.success('Answer generated successfully!');
    } catch (error) {
      toast.error('Failed to get answer. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRelatedQuestions = () => {
    const relatedQuestions = [
      "What is the main topic of this document?",
      "Can you summarize the key points?",
      "What are the important dates mentioned?",
      "Who are the main people or organizations mentioned?",
      "What are the conclusions or recommendations?"
    ];
    return relatedQuestions;
  };

  const handleRelatedQuestion = (relatedQ) => {
    setQuestion(relatedQ);
  };

  const clearAnswer = () => {
    setAnswer('');
    setSources([]);
    setConfidence(0);
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (conf) => {
    if (conf >= 0.8) return 'High Confidence';
    if (conf >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SolveX AI Q&A</h1>
            <p className="text-gray-600">Ask questions about your uploaded documents</p>
          </div>
        </div>

        {documents.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                No documents uploaded yet. Upload some documents to start asking questions.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Document Selection */}
              {documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Document (Optional)
                  </label>
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Ask about all documents</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.filename}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Question Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to know about your documents?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!question.trim() || loading || documents.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Ask Question</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Answer Display */}
          {answer && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Answer</h2>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                    {getConfidenceText(confidence)}
                  </span>
                  <button
                    onClick={clearAnswer}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-900 leading-relaxed">{answer}</p>
              </div>

              {/* Sources */}
              {sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sources</h3>
                  <div className="space-y-2">
                    {sources.map((sourceId, index) => {
                      const sourceDoc = documents.find(doc => doc.id === sourceId);
                      return (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{sourceDoc ? sourceDoc.filename : `Document ${sourceId}`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Suggested Questions</h3>
            </div>

            <div className="space-y-2">
              {generateRelatedQuestions().map((relatedQ, index) => (
                <button
                  key={index}
                  onClick={() => handleRelatedQuestion(relatedQ)}
                  className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {relatedQ}
                </button>
              ))}
            </div>
          </div>

          {/* Q&A History */}
          {qaHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Questions</h3>

              <div className="space-y-3">
                {qaHistory.slice(0, 5).map((qa) => (
                  <div key={qa.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {qa.question}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(qa.timestamp).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">
                        {getConfidenceText(qa.confidence)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Answers</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Ask specific questions for more accurate answers</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Select a specific document for targeted questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Use keywords from your documents in questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Check confidence scores for answer reliability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAPanel;
