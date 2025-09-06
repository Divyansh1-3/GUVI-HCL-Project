#!/bin/bash

echo "🎯 SolveX AI - Mission UpSkill India Hackathon"
echo "============================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.11+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file from template"
        echo "📝 Please edit .env file and add your OpenAI API key"
    else
        echo "❌ env.example not found"
        exit 1
    fi
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi
cd ..

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads chroma_db logs

# Start the application
echo "🚀 Starting Document Q&A System..."
echo ""
echo "Backend will start on: http://localhost:8000"
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start backend and frontend concurrently
cd backend && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

cd ../frontend && npm start &
FRONTEND_PID=$!

echo "✅ Application started successfully!"
echo ""
echo "📋 Access URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "💡 Upload documents and start asking questions!"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
