@echo off
echo 🚀 正在启动随文识字应用...
echo.
echo 📦 检查依赖...

REM 检查是否存在 node_modules
if not exist "node_modules" (
    echo 📥 正在安装依赖，请稍候...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 安装依赖失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
)

echo.
echo 🔨 启动应用...
echo.
echo 💡 应用将在 http://localhost:3000 运行
echo 🌐 如果浏览器没有自动打开，请手动访问上述地址
echo.
echo 按任意键开始启动...
pause >nul

REM 启动应用
start http://localhost:3000
npm start

echo.
echo ✅ 应用已启动！
echo 📱 如果看不到应用，请检查：
echo    1. 防火墙是否阻止了 Node.js
echo    2. 端口 3000 是否被占用
echo.
pause