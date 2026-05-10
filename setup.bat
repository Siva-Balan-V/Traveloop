@echo off
echo ========================================
echo Traveloop - Windows Setup Script
echo ========================================
echo.

REM Check if PostgreSQL is installed
echo [1/6] Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH
    echo.
    echo Please install PostgreSQL first:
    echo 1. Download from: https://www.postgresql.org/download/windows/
    echo 2. Run the installer
    echo 3. Add PostgreSQL to PATH
    echo 4. Run this script again
    echo.
    echo For detailed instructions, see WINDOWS_SETUP.md
    pause
    exit /b 1
)
echo [OK] PostgreSQL is installed
echo.

REM Check if Node.js is installed
echo [2/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo.
    echo Please install Node.js first:
    echo 1. Download from: https://nodejs.org/
    echo 2. Install the LTS version
    echo 3. Run this script again
    pause
    exit /b 1
)
echo [OK] Node.js is installed
node --version
npm --version
echo.

REM Create database
echo [3/6] Setting up database...
echo.
echo You will be prompted for your PostgreSQL password.
echo This is the password you set during PostgreSQL installation.
echo.
pause

REM Check if database exists
echo Checking if database exists...
psql -U postgres -lqt 2>nul | findstr /C:"traveloop" >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo Database 'traveloop' already exists.
    set /p recreate="Do you want to DROP and recreate it? (y/N): "
    if /i "%recreate%"=="y" (
        echo.
        echo Dropping existing database...
        psql -U postgres -c "DROP DATABASE IF EXISTS traveloop;"
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to drop database
            echo Please check your PostgreSQL password
            pause
            exit /b 1
        )
        echo Creating new database...
        psql -U postgres -c "CREATE DATABASE traveloop;"
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to create database
            pause
            exit /b 1
        )
        echo [OK] Database recreated
    ) else (
        echo Using existing database...
    )
) else (
    echo Creating database 'traveloop'...
    psql -U postgres -c "CREATE DATABASE traveloop;"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create database
        echo.
        echo Common issues:
        echo - Wrong password
        echo - PostgreSQL service not running
        echo.
        echo Try running: psql -U postgres
        echo If that works, run this script again.
        pause
        exit /b 1
    )
    echo [OK] Database created
)
echo.

REM Run schema
echo Running database schema...
cd database
psql -U postgres -d traveloop -f schema.sql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create schema
    echo.
    echo Trying with verbose output...
    psql -U postgres -d traveloop -f schema.sql
    cd ..
    pause
    exit /b 1
)
echo [OK] Schema created successfully
echo.

REM Run seed data
echo Running seed data...
psql -U postgres -d traveloop -f seed.sql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Failed to seed data
    echo.
    echo Trying with verbose output...
    psql -U postgres -d traveloop -f seed.sql
    cd ..
    pause
    exit /b 1
)
echo [OK] Seed data inserted successfully
cd ..
echo.

REM Verify database setup
echo Verifying database setup...
psql -U postgres -d traveloop -c "\dt" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Could not verify tables
) else (
    echo [OK] Database tables verified
)
echo.

REM Setup backend
echo [4/6] Setting up backend...
cd backend

if not exist node_modules (
    echo Installing backend dependencies (this may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env >nul
    echo [OK] Backend .env created
    echo.
    echo ========================================
    echo IMPORTANT: Configure backend\.env
    echo ========================================
    echo.
    echo Please edit backend\.env and update:
    echo.
    echo 1. DB_PASSWORD=your_postgres_password
    echo 2. JWT_SECRET=random_32_character_string
    echo 3. JWT_REFRESH_SECRET=another_random_string
    echo 4. EMAIL_USER=your_email@gmail.com (optional)
    echo 5. EMAIL_PASSWORD=your_gmail_app_password (optional)
    echo.
    echo Press any key to open the file in Notepad...
    pause >nul
    notepad .env
) else (
    echo [OK] Backend .env file already exists
)

cd ..
echo.

REM Setup frontend
echo [5/6] Setting up frontend...
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies (this may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env >nul
    echo [OK] Frontend .env created
) else (
    echo [OK] Frontend .env file already exists
)

cd ..
echo.

REM Final instructions
echo [6/6] Setup Complete!
echo ========================================
echo.
echo ✓ PostgreSQL installed and configured
echo ✓ Database created with 14 tables
echo ✓ Seed data inserted (20 countries, 33 cities, 50+ activities)
echo ✓ Backend dependencies installed
echo ✓ Frontend dependencies installed
echo ✓ Configuration files created
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Make sure backend\.env is configured with:
echo    - Your PostgreSQL password
echo    - JWT secrets (random strings)
echo    - Email settings (optional)
echo.
echo 2. Start the application:
echo    Run: start-all.bat
echo.
echo    OR start separately:
echo    Terminal 1: start-backend.bat
echo    Terminal 2: start-frontend.bat
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo ========================================
echo DOCUMENTATION:
echo ========================================
echo.
echo - Quick Start: WINDOWS_README.md
echo - Detailed Setup: WINDOWS_SETUP.md
echo - Troubleshooting: INSTALLATION_SUMMARY.md
echo.
echo ========================================
pause
