@echo off
echo 🎯 SolveX AI - Mission UpSkill India Hackathon
echo ============================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    if exist env.example (
        copy env.example .env
        echo ✅ Created .env file from template
        echo 📝 Please edit .env file and add your OpenAI API key
    ) else (
        echo ❌ env.example not found
        pause
        exit /b 1
    )
)

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
cd frontend
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
cd ..

REM Create necessary directories
echo 📁 Creating directories...
if not exist uploads mkdir uploads
if not exist chroma_db mkdir chroma_db
if not exist logs mkdir logs

REM Start the application
echo 🚀 Starting Document Q&A System...
echo.
echo Backend will start on: http://localhost:8000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start backend and frontend concurrently
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ✅ Application started successfully!
echo.
echo 📋 Access URLs:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo 💡 Upload documents and start asking questions!
pause
