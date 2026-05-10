@echo off
echo ========================================
echo Starting Traveloop Frontend Server
echo ========================================
echo.

cd frontend

if not exist node_modules (
    echo [ERROR] Dependencies not installed
    echo Please run setup.bat first
    pause
    exit /b 1
)

if not exist .env (
    echo [ERROR] .env file not found
    echo Please copy .env.example to .env
    pause
    exit /b 1
)

echo Starting frontend server on http://localhost:3000
echo.
echo Browser will open automatically
echo Press Ctrl+C to stop the server
echo.

npm start
