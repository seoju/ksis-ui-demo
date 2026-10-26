@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo KSIS UI demo - http://localhost:8090  (close this window to stop)
start "" cmd /c "timeout /t 15 > nul & start http://localhost:8090"
java -jar ksis-ui-demo.war
pause
