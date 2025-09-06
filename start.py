#!/usr/bin/env python3
"""
SolveX AI Startup Script
Mission UpSkill India Hackathon
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_requirements():
    """Check if all requirements are installed"""
    print("🔍 Checking requirements...")
    
    # Check Python version
    if sys.version_info < (3, 11):
        print("❌ Python 3.11+ is required")
        return False
    
    # Check if requirements.txt exists
    if not Path("requirements.txt").exists():
        print("❌ requirements.txt not found")
        return False
    
    # Check if .env file exists
    if not Path(".env").exists():
        print("⚠️  .env file not found, creating from template...")
        if Path("env.example").exists():
            subprocess.run(["cp", "env.example", ".env"])
            print("✅ Created .env file from template")
            print("📝 Please edit .env file and add your OpenAI API key")
        else:
            print("❌ env.example not found")
            return False
    
    print("✅ Requirements check passed")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Python dependencies installed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        return False

def setup_directories():
    """Create necessary directories"""
    print("📁 Setting up directories...")
    directories = ["uploads", "chroma_db", "logs"]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")

def start_backend():
    """Start the backend server"""
    print("🚀 Starting backend server...")
    try:
        os.chdir("backend")
        subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])
        print("✅ Backend server started on http://localhost:8000")
        return True
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False

def main():
    """Main startup function"""
    print("🎯 Document Q&A System - Mission UpSkill India Hackathon")
    print("=" * 60)
    
    # Check requirements
    if not check_requirements():
        print("❌ Requirements check failed. Please fix the issues above.")
        return 1
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        return 1
    
    # Setup directories
    setup_directories()
    
    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  OPENAI_API_KEY not found in environment variables")
        print("📝 Please add your OpenAI API key to the .env file")
        print("   Example: OPENAI_API_KEY=your_api_key_here")
        return 1
    
    # Start backend
    if not start_backend():
        return 1
    
    print("\n🎉 Document Q&A System is starting up!")
    print("📋 Next steps:")
    print("   1. Backend API: http://localhost:8000")
    print("   2. API Documentation: http://localhost:8000/docs")
    print("   3. Health Check: http://localhost:8000/health")
    print("   4. Start frontend: cd frontend && npm install && npm start")
    print("\n💡 The system is now ready for document upload and Q&A!")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
