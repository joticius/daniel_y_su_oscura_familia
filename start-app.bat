@echo off
cd /d "%~dp0"
echo Starting frontend server on http://localhost:3000
start "Frontend" php -S localhost:3000 -t FRONTEND
echo Starting backend server on http://localhost:8000
start "Backend" php -S localhost:8000 -t BACKEND\ms_1\Public BACKEND\ms_1\Public\router.php
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Press any key to finish this console once the servers are running...
pause >nul
