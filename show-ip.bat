@echo off
echo 正在获取本机IP地址...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo 你的IP地址是: %%b
        echo.
        echo 其他设备可以通过以下地址访问:
        echo http://%%b:3001
    )
)
echo.
pause