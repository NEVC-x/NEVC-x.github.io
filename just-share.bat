@echo off
title 随文识字应用 - 获取分享网址

echo 🌍 正在启动随文识字应用分享...
echo.

REM 检查 ngrok
if not exist "ngrok.exe" (
    echo 📥 下载 ngrok...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip', 'ngrok.zip')" >nul 2>&1
    powershell -Command "Expand-Archive -Path 'ngrok.zip' -DestinationPath '.' -Force" >nul 2>&1
    del ngrok.zip >nul 2>&1
    if exist "ngrok-stable-windows-amd64\ngrok.exe" (
        move "ngrok-stable-windows-amd64\ngrok.exe" "ngrok.exe" >nul 2>&1
        rd /s /q "ngrok-stable-windows-amd64" >nul 2>&1
    )
)

REM 构建项目（如果需要）
if not exist "build" (
    echo 🔨 构建项目...
    npm run build
)

REM 启动服务器
echo 🚀 启动服务器...
start "Server" node server-network.js
timeout /t 3 /nobreak >nul

REM 启动 ngrok 并显示网址
echo 🌐 生成分享网址...
echo.
echo 🎯 你的分享网址是：
echo.
ngrok http 3000 | findstr "Forwarding"

echo.
echo ✅ 复制上面的 https:// 开头的链接分享！
echo 📱 朋友用手机或电脑都能打开
echo.
pause