@echo off
echo 🚀 Deploy with Extensions - SolveX AI
echo =====================================

echo 📦 Installing required extensions...
code --install-extension vercel.vscode-vercel
code --install-extension ms-python.python
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode

echo 🔧 Setting up VS Code workspace...
echo ✅ Extensions installed!
echo.
echo 📋 Next Steps:
echo 1. Open VS Code
echo 2. Press Ctrl+Shift+P
echo 3. Type "Vercel: Deploy" for frontend
echo 4. Type "Railway: Deploy" for backend
echo.
echo 🎯 Or use the tasks:
echo - Press Ctrl+Shift+P
echo - Type "Tasks: Run Task"
echo - Select "Deploy to Vercel" or "Deploy to Railway"
echo.
pause
