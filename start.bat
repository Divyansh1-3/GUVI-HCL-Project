@echo off
echo 🎯 SolveX AI System Startup
echo ================================

echo 🚀 Starting backend server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo 🚀 Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ⏳ Waiting for frontend to initialize...
timeout /t 15 /nobreak > nul

echo.
echo 🎉 SolveX AI System is starting up!
echo 📋 Access points:
echo    • Frontend: http://localhost:3000
echo    • Backend API: http://127.0.0.1:8000
echo    • API Documentation: http://127.0.0.1:8000/docs
echo.
echo 💡 The system is now running in separate windows
echo    Close the windows to stop the services
echo.
pause
