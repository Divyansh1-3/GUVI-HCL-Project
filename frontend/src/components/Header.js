import React from 'react';
import { Menu, X, MessageSquare, FileText, Upload, BarChart3 } from 'lucide-react';

const Header = ({ sidebarOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'dashboard':
        return <BarChart3 className="w-5 h-5" />;
      case 'upload':
        return <Upload className="w-5 h-5" />;
      case 'documents':
        return <FileText className="w-5 h-5" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5" />;
      case 'qa':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'upload':
        return 'Upload Documents';
      case 'documents':
        return 'Document Library';
      case 'chat':
        return 'AI Chat';
      case 'qa':
        return 'Document Q&A';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            {getTabIcon(activeTab)}
            <h1 className="text-xl font-semibold text-gray-900">
              {getTabTitle(activeTab)}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
            <span className="text-sm font-medium text-gray-700">SolveX AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
