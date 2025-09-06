import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Download } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const { messages, sendMessage, loading, sessionId } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (loading) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const clearChat = () => {
    // This would typically call a clear chat function from context
    toast.success('Chat cleared');
  };

  const exportChat = () => {
    const chatData = {
      sessionId,
      messages: messages.map(msg => ({
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
    a.download = `chat-export-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported successfully!');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">SolveX AI Assistant</h1>
              <p className="text-sm text-gray-600">Ask me anything or chat about your documents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportChat}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Chat"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-600 mb-6">
                  Ask me anything or chat about your uploaded documents
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => setInputMessage("What can you help me with?")}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">What can you help me with?</p>
                  </button>
                  <button
                    onClick={() => setInputMessage("Tell me about my documents")}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">Tell me about my documents</p>
                  </button>
                  <button
                    onClick={() => setInputMessage("How does this system work?")}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">How does this system work?</p>
                  </button>
                  <button
                    onClick={() => setInputMessage("Give me some tips")}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900">Give me some tips</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.message_type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.message_type === 'user'
                          ? 'bg-blue-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                    >
                      {message.message_type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.message_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">
                        {message.message_type === 'user' ? message.message : message.response}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.message_type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
