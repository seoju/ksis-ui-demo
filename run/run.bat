@echo off
chcp 65001 > nul
cd /d "%~dp0"
title KSIS UI demo
rem An older demo still holding port 8090 makes the new war fail to start while the browser keeps showing the old screens.
netstat -ano | findstr /r /c:":8090 .*LISTENING" > nul
if errorlevel 1 goto start
echo.
echo [!] Port 8090 is already in use. An older KSIS UI demo is probably still running.
echo     Close that black window, or end "Java" / "OpenJDK Platform binary" in Task Manager, then run run.bat again.
echo.
pause
exit /b 1
:start
echo KSIS UI demo - http://localhost:8090  (close this window to stop)
start "" cmd /c "timeout /t 15 > nul & start http://localhost:8090"
java -jar ksis-ui-demo.war
pause
