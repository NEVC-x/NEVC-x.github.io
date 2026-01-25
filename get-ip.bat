@echo off
echo 🌐 获取网络访问地址
echo =================================
echo.

REM 检查是否已构建
if not exist "build" (
    echo 🔨 项目尚未构建，正在构建...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
)

REM 获取IP地址
echo 📡 正在获取本机IP地址...
echo.

REM 使用 netsh 获取IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo 🌐 网络访问地址：
        echo    http://%%b:3000
        echo.
        echo 💡 分享给朋友：
        echo    复制上面的地址发送给朋友
        echo.
        echo 📱 本地访问：
        echo    http://localhost:3000
    )
)

echo.
echo ✅ 获取完成！
echo.
echo 🔧 如果无法访问：
echo    1. 确保所有设备在同一WiFi网络
echo    2. 检查防火墙设置
echo    3. 尝试使用 share-app.bat 启动服务器
echo.
pause