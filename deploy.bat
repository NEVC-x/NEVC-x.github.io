@echo off
echo 🚀 开始部署随文识字应用到 Netlify...

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先安装 Git: https://git-scm.com/
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
npm install
if %errorlevel% neq 0 (
    echo ❌ 安装依赖失败
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 构建项目...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo ✅ 构建成功！

REM 创建 README
echo 📝 创建部署说明...
echo # 随文识字应用部署指南 > DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo ## 🌐 快速部署 >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo ### Netlify 部署（推荐） >> DEPLOYMENT.md
echo 1. 访问 https://netlify.com >> DEPLOYMENT.md
echo 2. 点击 "New site from Git" >> DEPLOYMENT.md
echo 3. 选择 GitHub 仓库 >> DEPLOYMENT.md
echo 4. Build command: npm run build >> DEPLOYMENT.md
echo 5. Publish directory: build >> DEPLOYMENT.md
echo 6. 点击 "Deploy site" >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo ### Vercel 部署 >> DEPLOYMENT.md
echo 1. 访问 https://vercel.com >> DEPLOYMENT.md
echo 2. 导入项目并部署 >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo ### GitHub Pages 部署 >> DEPLOYMENT.md
echo 1. 在 package.json 中添加 "homepage": "https://你的用户名.github.io/仓库名" >> DEPLOYMENT.md
echo 2. 推送到 GitHub >> DEPLOYMENT.md
echo 3. 仓库 Settings → Pages → Enable >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo ## 📱 本地测试 >> DEPLOYMENT.md
echo npm install -g serve ^&^& serve -s build >> DEPLOYMENT.md

echo 🎉 部署准备完成！
echo.
echo 💡 手动部署步骤：
echo 1. 将代码推送到 GitHub
echo 2. 使用 Netlify 或 Vercel 部署
echo 3. 或者使用本地服务器：npm install -g serve ^&^& serve -s build
echo.
pause