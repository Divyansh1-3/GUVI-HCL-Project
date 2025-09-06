import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';
import QAPanel from './components/QAPanel';
import Dashboard from './components/Dashboard';
import { DocumentProvider } from './context/DocumentContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DocumentProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <div className="flex">
              <Sidebar 
                sidebarOpen={sidebarOpen} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              
              <main className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? 'ml-64' : 'ml-16'
              }`}>
                <div className="p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<DocumentUpload />} />
                    <Route path="/documents" element={<DocumentList />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/qa" element={<QAPanel />} />
                  </Routes>
                </div>
              </main>
            </div>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ChatProvider>
    </DocumentProvider>
  );
}

export default App;
