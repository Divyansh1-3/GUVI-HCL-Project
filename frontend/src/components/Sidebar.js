import React from 'react';
import { 
  BarChart3, 
  Upload, 
  FileText, 
  MessageSquare, 
  HelpCircle,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'upload', label: 'Upload', icon: Upload, path: '/upload' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, path: '/chat' },
    { id: 'qa', label: 'Document Q&A', icon: HelpCircle, path: '/qa' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className={`fixed left-0 top-16 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 ${
      sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="space-y-2">
            <button className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900`}>
              <Settings className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && (
                <span className="font-medium">Settings</span>
              )}
            </button>
            
            <button className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900`}>
              <LogOut className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && (
                <span className="font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
