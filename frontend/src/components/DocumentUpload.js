import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import toast from 'react-hot-toast';

const DocumentUpload = () => {
  const { uploadDocument, loading } = useDocument();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload files
    for (const fileObj of newFiles) {
      try {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'uploading', progress: 50 }
              : f
          )
        );

        const result = await uploadDocument(fileObj.file);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'completed', progress: 100, result }
              : f
          )
        );

        toast.success(`${fileObj.file.name} uploaded successfully!`);
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'error', progress: 0 }
              : f
          )
        );
        toast.error(`Failed to upload ${fileObj.file.name}: ${error.message}`);
      }
    }
  }, [uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      case 'csv':
        return '📊';
      default:
        return '📄';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uploading':
        return <div className="spinner" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">
          Upload PDF, DOCX, TXT, or CSV files to start asking questions and getting AI-powered insights.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-600 mb-4">
            or click to select files
          </p>
          <div className="text-sm text-gray-500">
            <p>Supported formats: PDF, DOCX, TXT, CSV</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(fileObj.file.name)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileObj.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {fileObj.status === 'uploading' && (
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileObj.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {getStatusIcon(fileObj.status)}
                  
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Use clear, well-structured documents for better question answering</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>PDF files with selectable text work better than scanned images</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Upload multiple related documents to get comprehensive answers</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>After uploading, try asking specific questions about the content</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;
