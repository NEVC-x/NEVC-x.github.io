@echo off
echo 🌍 随文识字应用 - 公网分享版
echo =================================
echo.
echo 📥 正在下载 ngrok...
echo.

REM 下载 ngrok
if not exist "ngrok.exe" (
    echo 📥 下载 ngrok...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip', 'ngrok.zip')"

    REM 解压 ngrok
    echo 📦 解压 ngrok...
    powershell -Command "Expand-Archive -Path 'ngrok.zip' -DestinationPath '.' -Force"

    REM 删除 zip 文件
    del ngrok.zip

    REM 重命名可执行文件
    if exist "ngrok-stable-windows-amd64\ngrok.exe" (
        move "ngrok-stable-windows-amd64\ngrok.exe" "ngrok.exe" >nul 2>&1
        rd /s /q "ngrok-stable-windows-amd64"
    )

    echo ✅ ngrok 下载完成
    echo.
)

REM 检查是否需要构建项目
if not exist "build" (
    echo 🔨 构建项目...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
)

REM 启动本地服务器
echo 🚀 启动本地服务器...
start "Local Server" node server-network.js

REM 等待服务器启动
echo ⏳ 等待服务器启动...
timeout /t 3 /nobreak >nul

echo 🌐 启动 ngrok 隧道...
echo.

REM 启动 ngrok
ngrok http 3000

echo.
echo ✅ ngrok 已停止
pause