@echo off
echo 🌍 随文识字应用 - 公网分享版（简化版）
echo =================================
echo.
echo 📥 正在下载 ngrok...
echo.

REM 下载 ngrok
if not exist "ngrok.exe" (
    echo 📥 正在下载 ngrok，这可能需要几秒钟...
    powershell -Command "& { try { (New-Object System.Net.WebClient).DownloadFile('https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip', 'ngrok.zip') } catch { exit 1 } }"

    if %errorlevel% neq 0 (
        echo ❌ 下载失败，正在尝试备用下载源...
        powershell -Command "& { try { (New-Object System.Net.WebClient).DownloadFile('https://downloadngrok.s3.amazonaws.com/ngrok-stable-windows-amd64.zip', 'ngrok.zip') } catch { exit 1 } }"
    )

    if %errorlevel% neq 0 (
        echo ❌ 下载失败，请手动下载 ngrok
        echo 下载地址：https://ngrok.com/download
        echo 下载后将 ngrok.exe 放在此目录
        pause
        exit /b 1
    )

    REM 解压 ngrok
    echo 📦 解压 ngrok...
    powershell -Command "Expand-Archive -Path 'ngrok.zip' -DestinationPath '.' -Force"

    REM 删除 zip 文件
    del ngrok.zip

    REM 移动 ngrok.exe 到根目录
    if exist "ngrok-stable-windows-amd64\ngrok.exe" (
        move "ngrok-stable-windows-amd64\ngrok.exe" "ngrok.exe" >nul 2>&1
        rd /s /q "ngrok-stable-windows-amd64" 2>nul
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
    echo ✅ 构建完成
    echo.
)

REM 启动本地服务器
echo 🚀 启动本地服务器...
echo 💡 请不要关闭此窗口
echo.

REM 检查端口是否被占用
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 已被占用，尝试其他端口...
    set PORT=3001
)

REM 启动服务器并保存进程ID
start "" /b cmd /c "node server-network.js" && set SERVER_PID=%errorlevel%

REM 等待服务器启动
echo ⏳ 等待服务器启动...
timeout /t 5 /nobreak >nul

REM 测试服务器是否启动
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服务器启动成功
) else (
    echo ⚠️  服务器启动可能需要更长时间...
    timeout /t 3 /nobreak >nul
)

echo.
echo 🌐 启动 ngrok 隧道...
echo 📝 请在下方显示的 URL 中复制分享链接
echo.

REM 启动 ngrok
ngrok http %PORT%

REM 清理
echo.
if defined SERVER_PID (
    taskkill /PID %SERVER_PID% /F >nul 2>&1
)
echo ✅ ngrok 已停止
pause