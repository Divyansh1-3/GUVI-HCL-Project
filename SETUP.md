# Setup Guide - Document Q&A System

This guide will help you set up and run the Document Q&A System for the Mission UpSkill India Hackathon.

## 🎯 Quick Setup (5 minutes)

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- OpenAI API key
- Git

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd document-qa-system

# Copy environment file
cp env.example .env
```

### Step 2: Configure Environment
Edit the `.env` file and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### Step 3: Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install-all
```

### Step 4: Run the Application
```bash
# Start both backend and frontend
npm run dev
```

### Step 5: Access the Application
- Open your browser and go to: http://localhost:3000
- The backend API will be available at: http://localhost:8000

## 🐳 Docker Setup (Alternative)

If you prefer Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

## 📋 Detailed Setup Instructions

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   export SECRET_KEY="your-secret-key-here"
   ```

5. **Run the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - Database
DATABASE_URL=sqlite:///./document_qa.db
CHROMA_PERSIST_DIRECTORY=./chroma_db

# Optional - File Upload
UPLOAD_DIRECTORY=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Optional - Security
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional - CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### File Upload Configuration

The system supports the following file types:
- **PDF**: `.pdf` files
- **Word Documents**: `.docx` files
- **Text Files**: `.txt` files
- **CSV Files**: `.csv` files

Maximum file size: 10MB per file

## 🧪 Testing the Setup

### 1. Health Check
Visit http://localhost:8000/health to verify the backend is running.

### 2. API Documentation
Visit http://localhost:8000/docs to see the interactive API documentation.

### 3. Upload a Test Document
1. Go to http://localhost:3000
2. Click on "Upload" in the sidebar
3. Upload a test PDF or text file
4. Wait for processing to complete

### 4. Test Q&A Functionality
1. Go to the "Document Q&A" tab
2. Ask a question about your uploaded document
3. Verify you get a relevant answer

### 5. Test Chat Functionality
1. Go to the "AI Chat" tab
2. Send a message to the AI assistant
3. Verify you get a response

## 🚨 Troubleshooting

### Common Issues

#### 1. OpenAI API Key Error
```
Error: OpenAI API key not found
```
**Solution**: Make sure you've set the `OPENAI_API_KEY` environment variable correctly.

#### 2. Port Already in Use
```
Error: Port 8000 is already in use
```
**Solution**: 
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --reload --port 8001
```

#### 3. Frontend Build Errors
```
Error: Module not found
```
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Database Connection Issues
```
Error: Database connection failed
```
**Solution**: Make sure the database file has proper permissions:
```bash
chmod 664 document_qa.db
```

#### 5. File Upload Issues
```
Error: File too large
```
**Solution**: Check the `MAX_FILE_SIZE` environment variable and ensure your file is under 10MB.

### Performance Issues

#### Slow Document Processing
- Ensure you have sufficient RAM (4GB+ recommended)
- Use SSD storage for better I/O performance
- Close other resource-intensive applications

#### Slow API Responses
- Check your internet connection for OpenAI API calls
- Consider using a faster OpenAI model
- Implement caching for frequently asked questions

## 📊 System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space
- **OS**: Windows 10, macOS 10.15, or Ubuntu 18.04+

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 10GB+ free space (SSD preferred)
- **OS**: Latest version of Windows, macOS, or Ubuntu

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
npm update
```

### Database Maintenance
```bash
# Backup database
cp document_qa.db document_qa_backup.db

# Clean up old files
rm -rf uploads/*
rm -rf chroma_db/*
```

### Log Monitoring
```bash
# View application logs
tail -f logs/app.log

# View Docker logs
docker-compose logs -f
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify environment variables** are set correctly
3. **Ensure all dependencies** are installed
4. **Check system requirements** are met
5. **Create an issue** in the repository with:
   - Error message
   - Steps to reproduce
   - System information
   - Log files (if applicable)

## 🎉 Success!

Once everything is running, you should see:
- ✅ Backend API running on port 8000
- ✅ Frontend application running on port 3000
- ✅ Database initialized
- ✅ Vector store ready
- ✅ OpenAI API connected

You're now ready to use the Document Q&A System!

---

**Happy coding! 🚀**
