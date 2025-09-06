# SolveX AI System Startup Script
Write-Host "🎯 SolveX AI System Startup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "⏳ Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "🎉 SolveX AI System is starting up!" -ForegroundColor Green
Write-Host "📋 Access points:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Backend API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "   • API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 The system is now running in separate windows" -ForegroundColor Yellow
Write-Host "   Close the windows to stop the services" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
