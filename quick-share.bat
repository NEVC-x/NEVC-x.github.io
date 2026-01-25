@echo off
title 随文识字应用 - 快速分享
color 0A

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║                     🌍 随文识字应用                          ║
echo  ║                         快速分享                             ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

REM 检查 ngrok
if not exist "ngrok.exe" (
    echo 📥 正在下载 ngrok...
    echo    这可能需要一些时间，请耐心等待...
    echo.

    REM 尝试下载
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip', 'ngrok.zip')" >nul 2>&1

    if errorlevel 1 (
        echo ❌ 下载失败，请手动下载 ngrok
        echo.
        echo 📥 手动下载步骤：
        echo    1. 访问：https://ngrok.com/download
        echo    2. 下载 Windows 版本
        echo    3. 将 ngrok.exe 解压到本文件夹
        echo.
        pause
        exit /b 1
    )

    echo 📦 正在解压...
    powershell -Command "Expand-Archive -Path 'ngrok.zip' -DestinationPath '.' -Force" >nul 2>&1
    del ngrok.zip >nul 2>&1

    if exist "ngrok-stable-windows-amd64\ngrok.exe" (
        move "ngrok-stable-windows-amd64\ngrok.exe" "ngrok.exe" >nul 2>&1
        rd /s /q "ngrok-stable-windows-amd64" >nul 2>&1
    )

    echo ✅ ngrok 准备完成！
    echo.
)

REM 检查是否需要构建
if not exist "build" (
    echo 🔨 正在构建应用...
    echo.
    npm run build
    if errorlevel 1 (
        echo ❌ 构建失败，请检查 Node.js 是否正确安装
        pause
        exit /b 1
    )
    echo ✅ 构建完成！
    echo.
)

REM 启动服务器
echo 🚀 启动本地服务器...
echo    请保持此窗口开启
echo.
start "Local Server" cmd /c "node server-network.js"
timeout /t 3 /nobreak >nul

echo 🌐 启动公网隧道...
echo    🔗 请在下面的输出中寻找以 https:// 开头的链接
echo    ⚡ 那就是你的分享网址！
echo.
echo ================================================================
echo.
echo 📝 重要提示：网址会在下面的 ngrok 输出中显示
echo 📝 请寻找类似这样的格式：
echo    Forwarding  https://xxxxx.ngrok.io -> http://localhost:3000
echo 📝 复制 https://xxxxx.ngrok.io 就是你的分享地址！
echo.
echo ================================================================
echo.
echo 💡 ngrok 启动中，请稍候...
echo.

REM 启动 ngrok
ngrok http 3000

echo.
echo ================================================================
echo ✅ 分享已结束，感谢使用！
pause