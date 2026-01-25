# 随文识字应用启动脚本 - PowerShell 版本

Write-Host "🚀 正在启动随文识字应用..." -ForegroundColor Green
Write-Host ""

# 检查是否存在 node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 正在安装依赖，请稍候..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 安装依赖失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 启动应用..." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 应用将在 http://localhost:3000 运行" -ForegroundColor Cyan
Write-Host "🌐 如果浏览器没有自动打开，请手动访问上述地址" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键开始启动..." -ForegroundColor Yellow
Read-Host

# 启动浏览器
Start-Process "http://localhost:3000"

# 启动应用
npm start

Write-Host ""
Write-Host "✅ 应用已启动！" -ForegroundColor Green
Write-Host "📱 如果看不到应用，请检查：" -ForegroundColor Yellow
Write-Host "   1. 防火墙是否阻止了 Node.js" -ForegroundColor Yellow
Write-Host "   2. 端口 3000 是否被占用" -ForegroundColor Yellow
Write-Host ""
Read-Host "按任意键退出"