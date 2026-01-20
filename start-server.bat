@echo off
echo 正在启动随文识字应用...
echo.
echo 应用启动后，可通过以下地址访问：
echo 本地访问: http://localhost:3000
echo 网络访问: http://192.168.1.15:3000
echo.
echo 按任意键开始启动...
pause >nul

start "React Server" cmd /k "node_modules\.bin\react-scripts start --host 0.0.0.0 --port 3000"

echo.
echo 服务器已启动！
echo 如果需要停止服务器，请关闭所有打开的命令行窗口。
echo.
pause