@echo off
echo ========================================
echo 启动随文识字应用（开发模式）
echo ========================================
echo.
echo 正在启动服务器，请稍候...
echo.

cd /d "%~dp0"

start "React Server" cmd /k "npm start"

echo.
echo ✅ 服务器启动成功！
echo.
echo 访问地址：
echo 本地: http://localhost:3000
echo 网络: http://192.168.1.15:3000
echo.
echo 按任意键关闭此窗口...
pause >nul