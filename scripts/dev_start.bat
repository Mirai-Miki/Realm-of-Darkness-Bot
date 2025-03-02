@echo off
echo Starting development environment...

:: Open PowerShell windows for each bot
start powershell -NoExit "cd '%~dp0..' ; npm run dev:5th"
timeout /t 2 > nul
start powershell -NoExit "cd '%~dp0..' ; npm run dev:20th"
timeout /t 2 > nul
start powershell -NoExit "cd '%~dp0..' ; npm run dev:cod"

echo All bots started in separate windows.