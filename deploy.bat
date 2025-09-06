@echo off
echo 🚀 SolveX AI Deployment Script
echo ================================

echo 📦 Installing Vercel CLI...
npm install -g vercel

echo 🔐 Login to Vercel...
vercel login

echo 🌐 Deploying Frontend to Vercel...
cd frontend
vercel --prod

echo ✅ Frontend deployed!
echo.
echo 📋 Next Steps:
echo 1. Deploy backend to Railway or Render
echo 2. Update API URLs in frontend
echo 3. Test your live application
echo.
echo 🎯 Your project will be live at the Vercel URL!
pause
