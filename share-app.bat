@echo off
echo 🌐 随文识字应用 - 网络分享版
echo =================================
echo.

REM 检查是否存在 build 文件夹
if not exist "build" (
    echo 🔨 首次运行需要构建项目...
    echo.
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
    echo ✅ 构建完成
    echo.
)

echo 🚀 正在启动网络服务器...
echo.
echo 💡 服务器启动后，可以通过以下地址访问：
echo 📱 本地：http://localhost:3000
echo 🌐 网络：http://[你的IP]:3000
echo.
echo ⚠️  重要提醒：
echo    - 确保所有设备连接在同一WiFi网络
echo    - 防火墙可能需要允许 Node.js 访问
echo    - 服务器将持续运行，直到按 Ctrl+C
echo.
echo 按任意键启动服务器...
pause >nul

REM 启动网络服务器
node server-network.js

echo.
pause