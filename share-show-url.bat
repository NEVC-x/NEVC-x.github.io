@echo off
title 随文识字应用 - 分享并显示网址
color 0A

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║                     🌍 随文识字应用                          ║
echo  ║                     分享并显示网址                            ║
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
echo    🔗 请等待网址生成...
echo.
echo ================================================================
echo.

REM 使用 PowerShell 监控并显示网址
echo 💡 正在启动 ngrok，网址生成后将自动显示...
echo.

REM 创建临时文件来存储网址
type nul > url.txt

REM 启动 ngrok 并捕获输出
ngrok http 3000 | findstr "Forwarding" > ngrok_output.txt

REM 读取并显示网址
if exist ngrok_output.txt (
    for /f "tokens=2" %%i in (ngrok_output.txt) do (
        set url=%%i
        echo.
        echo 🎉 找到网址了！
        echo.
        echo ╔═════════════════════════════════════════════════════════════╗
        echo ║                        🌐 分享网址                           ║
        echo ╚═════════════════════════════════════════════════════════════╝
        echo.
        echo ✅ 你的分享网址是：
        echo    %url%
        echo.
        echo 📱 复制上面的网址发送给朋友！
        echo 💻 朋友可以用任何浏览器打开
        echo 🎯 支持手机、电脑、平板访问
        echo.
        echo ╔═════════════════════════════════════════════════════════════╗
        echo.

        REM 保存网址到文件
        echo %url% > share_url.txt
    )
)

REM 清理临时文件
if exist ngrok_output.txt del ngrok_output.txt >nul 2>&1

echo.
echo ✅ ngrok 正在运行，网址已显示在上方
echo 📝 按 Ctrl+C 或关闭此窗口可停止分享
echo.
pause