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
echo 🌐 应用将在浏览器中自动打开
echo 💡 如果浏览器没有自动打开，请手动访问: http://localhost:3000
echo.
echo 按任意键开始启动...
pause >nul

REM 启动应用
start "" http://localhost:3000
npm start

echo.
echo ✅ 应用已启动！
echo 📱 如果看不到应用，请检查浏览器是否被阻止
echo.
pause