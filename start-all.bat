@echo off
echo ========================================
echo Starting Traveloop Application
echo ========================================
echo.

echo This will start both backend and frontend servers
echo in separate windows.
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause >nul

REM Start backend in new window
start "Traveloop Backend" cmd /k "cd /d %~dp0 && start-backend.bat"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Traveloop Frontend" cmd /k "cd /d %~dp0 && start-frontend.bat"

echo.
echo ========================================
echo Servers are starting...
echo.
echo Backend: Check "Traveloop Backend" window
echo Frontend: Check "Traveloop Frontend" window
echo.
echo Browser will open automatically at http://localhost:3000
echo.
echo To stop servers: Close the terminal windows or press Ctrl+C
echo ========================================
