# 随文识字应用自动部署脚本
# PowerShell 脚本

Write-Host "🚀 开始自动部署随文识字应用到 Netlify..." -ForegroundColor Green

# 检查是否安装了 Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 请先安装 Node.js: https://nodejs.org/" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 检查是否安装了 Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 请先安装 Git: https://git-scm.com/" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 检查是否安装了 Netlify CLI
try {
    $netlifyVersion = netlify --version
    Write-Host "✅ Netlify CLI 已安装: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "📥 正在安装 Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 安装 Netlify CLI 失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host "✅ Netlify CLI 安装成功" -ForegroundColor Green
}

# 安装项目依赖
Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 安装依赖失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 构建项目
Write-Host "🔨 构建项目..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✅ 构建成功！" -ForegroundColor Green

# 检查是否已登录 Netlify
Write-Host "🔑 检查 Netlify 登录状态..." -ForegroundColor Yellow
try {
    netlify status --json | ConvertFrom-Json
    Write-Host "✅ 已登录 Netlify" -ForegroundColor Green
} catch {
    Write-Host "⚠️  未登录 Netlify，请先登录：" -ForegroundColor Yellow
    Write-Host "   netlify login" -ForegroundColor White
    Write-Host ""
    Write-Host "登录完成后，按任意键继续部署..." -ForegroundColor Yellow
    Read-Host
}

# 询问是否要部署
$deploy = Read-Host "是否要部署到 Netlify？(y/n)"
if ($deploy -ne "y" -and $deploy -ne "Y") {
    Write-Host "部署已取消" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 0
}

# 部署到 Netlify
Write-Host "🌐 开始部署到 Netlify..." -ForegroundColor Yellow
$deployResult = netlify deploy --prod

# 显示部署结果
Write-Host ""
Write-Host "🎉 部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 部署信息：" -ForegroundColor Yellow
Write-Host $deployResult
Write-Host ""

# 提示访问
Write-Host "💡 访问你的应用：" -ForegroundColor Cyan
Write-Host "   复制上面的网址链接到浏览器中访问" -ForegroundColor White
Write-Host ""

# 询问是否打开浏览器
$openBrowser = Read-Host "是否要在浏览器中打开？(y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    # 提取网址
    if ($deployResult -match "https://[^\s]+") {
        $url = $matches[0]
        Start-Process $url
        Write-Host "🌐 已在浏览器中打开: $url" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 恭喜！你的随文识字应用已成功部署！" -ForegroundColor Green
Read-Host "按任意键退出"