# SolveX AI - Document Q&A System

A comprehensive Document Q&A System with chat functionality built for the Mission UpSkill India Hackathon.

## 🚀 Features

- **Document Upload**: Support for PDF, DOCX, TXT, and CSV files
- **AI-Powered Q&A**: Ask questions about your uploaded documents
- **Chat Interface**: General chat functionality with AI assistant
- **Vector Search**: Advanced document search using ChromaDB
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **OpenAI**: GPT-3.5-turbo for AI responses
- **ChromaDB**: Vector database for document embeddings
- **SQLAlchemy**: Database ORM
- **SQLite**: Lightweight database
- **LangChain**: Framework for LLM applications

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Framer Motion**: Animation library

## 📋 Prerequisites

- **Python 3.11+**: [Download from python.org](https://www.python.org/downloads/)
- **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
- **OpenAI API Key**: Get one from [OpenAI](https://platform.openai.com/api-keys)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Document Q&A System"
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   - Copy `env.example` to `.env`
   - Add your OpenAI API key to the `.env` file
   ```bash
   cp env.example .env
   ```

## 🚀 Running the System

### Option 1: Using the startup script (Recommended)
```bash
# Windows
.\start.bat

# Or PowerShell
.\start.ps1
```

### Option 2: Manual startup

**Start Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Start Frontend (in a new terminal):**
```bash
cd frontend
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

## 📖 Usage

1. **Upload Documents**: Go to the Upload tab and drag & drop your files
2. **Ask Questions**: Use the Q&A tab to ask questions about your documents
3. **Chat**: Use the Chat tab for general conversation with the AI
4. **View Documents**: Check the Documents tab to see all uploaded files

## 🔧 API Endpoints

### Document Management
- `POST /upload` - Upload a document
- `GET /documents` - List all documents
- `DELETE /documents/{document_id}` - Delete a document
- `GET /documents/{document_id}/content` - Get document content

### Q&A
- `POST /qa` - Ask a question about documents

### Chat
- `POST /chat` - Send a chat message

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Kill existing processes or use a different port
- **Python not found**: Make sure Python is installed and added to PATH
- **Import errors**: Run `pip install -r requirements.txt` again

### Frontend Issues
- **Port 3000 already in use**: The frontend will automatically use the next available port
- **npm not found**: Make sure Node.js and npm are installed
- **Build errors**: Delete `node_modules` and run `npm install` again

### General Issues
- **OpenAI API errors**: Check your API key in the `.env` file
- **Database errors**: Delete `document_qa.db` to reset the database
- **Vector store errors**: Delete the `chroma_db` folder to reset embeddings

## 📁 Project Structure

```
Document Q&A System/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models/
│   │   └── database.py      # Database models
│   ├── services/
│   │   ├── chat_service.py  # Chat functionality
│   │   ├── document_service.py # Document management
│   │   └── qa_service.py    # Q&A functionality
│   └── utils/
│       ├── file_processor.py # File processing utilities
│       └── vector_store.py  # Vector database operations
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   └── App.js          # Main application component
│   └── package.json        # Node.js dependencies
├── uploads/                # Uploaded files storage
├── chroma_db/             # Vector database storage
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Mission UpSkill India Hackathon

This project was developed for the Mission UpSkill India Hackathon, showcasing modern AI technologies and full-stack development skills.

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Review the API documentation at http://127.0.0.1:8000/docs
3. Create an issue in the repository

---

**Happy coding! 🚀**