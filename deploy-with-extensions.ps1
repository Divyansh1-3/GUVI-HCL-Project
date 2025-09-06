Write-Host "🚀 Deploy with Extensions - SolveX AI" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "📦 Installing required extensions..." -ForegroundColor Yellow
code --install-extension vercel.vscode-vercel
code --install-extension ms-python.python
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.powershell

Write-Host "🔧 Setting up VS Code workspace..." -ForegroundColor Yellow
Write-Host "✅ Extensions installed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open VS Code" -ForegroundColor White
Write-Host "2. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. Type 'Vercel: Deploy' for frontend" -ForegroundColor White
Write-Host "4. Type 'Railway: Deploy' for backend" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Or use the tasks:" -ForegroundColor Cyan
Write-Host "- Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "- Type 'Tasks: Run Task'" -ForegroundColor White
Write-Host "- Select 'Deploy to Vercel' or 'Deploy to Railway'" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
