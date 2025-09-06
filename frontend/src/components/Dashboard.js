import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Upload
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useDocument } from '../context/DocumentContext';

const Dashboard = () => {
  const { documents } = useDocument();
  const { messages } = useChat();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalMessages: 0,
    recentActivity: []
  });

  useEffect(() => {
    setStats({
      totalDocuments: documents.length,
      totalMessages: messages.length,
      recentActivity: [
        ...documents.slice(0, 3).map(doc => ({
          type: 'document',
          title: doc.filename,
          time: new Date(doc.upload_date).toLocaleString(),
          status: doc.processed
        })),
        ...messages.slice(0, 2).map(msg => ({
          type: 'message',
          title: msg.message.substring(0, 50) + '...',
          time: new Date(msg.timestamp).toLocaleString(),
          status: 'completed'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
    });
  }, [documents, messages]);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'document':
          return <FileText className="w-4 h-4" />;
        case 'message':
          return <MessageSquare className="w-4 h-4" />;
        default:
          return <Clock className="w-4 h-4" />;
      }
    };

    const getStatusColor = () => {
      switch (activity.status) {
        case 'completed':
          return 'text-green-600';
        case 'processing':
          return 'text-yellow-600';
        case 'failed':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
        <div className={`text-xs font-medium ${getStatusColor()}`}>
          {activity.status}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to SolveX AI
        </h1>
        <p className="text-gray-600">
          Upload documents, ask questions, and chat with AI to get intelligent insights from your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={stats.totalDocuments}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard
          title="Chat Messages"
          value={stats.totalMessages}
          icon={MessageSquare}
          color="bg-green-500"
        />
        <StatCard
          title="Uploads Today"
          value={documents.filter(doc => {
            const today = new Date();
            const uploadDate = new Date(doc.upload_date);
            return uploadDate.toDateString() === today.toDateString();
          }).length}
          icon={Upload}
          color="bg-purple-500"
        />
        <StatCard
          title="System Status"
          value="Online"
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-2">
                {stats.recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-5 h-5" />
              <span>Upload Document</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Start Chat</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <FileText className="w-5 h-5" />
              <span>Ask Question</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">API Server</span>
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Vector Database</span>
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">AI Service</span>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
