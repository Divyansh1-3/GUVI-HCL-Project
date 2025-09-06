@echo off
echo 🚀 Quick Deploy - SolveX AI
echo ==========================

echo 📦 Deploying Frontend to Vercel...
cd frontend
vercel --prod --yes
cd ..

echo.
echo 📦 Deploying Backend to Railway...
cd backend
railway up --detach
cd ..

echo.
echo ✅ Deployment Complete!
echo.
echo 📋 Your app is now live:
echo - Frontend: Check Vercel dashboard
echo - Backend: Check Railway dashboard
echo.
pause
