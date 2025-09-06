@echo off
echo 🚀 Deploying to Vercel - SolveX AI
echo ==================================

echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🔨 Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo ✅ Frontend build successful!
echo.
echo 📋 Next steps:
echo 1. Go to vercel.com
echo 2. Import your GitHub repository
echo 3. Set Root Directory to "frontend"
echo 4. Deploy!
echo.
pause
