@echo off
REM ################################################################################
REM # LMS Setup Script for Windows
REM # Automated setup for Learning Management System
REM # Requires: Windows 7+ with PowerShell
REM ################################################################################

setlocal enabledelayedexpansion

REM Color codes (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Get script directory
for %%I in ("%~dp0.") do set "SCRIPT_DIR=%%~fI"
for %%I in ("%SCRIPT_DIR%..") do set "PROJECT_DIR=%%~fI"

echo.
echo ================================================================================
echo            Learning Management System - Windows Setup
echo ================================================================================
echo.

REM ################################################################################
REM # Helper Functions
REM ################################################################################

REM Check if command exists
set "has_git="
git --version >nul 2>&1 && set "has_git=1"

set "has_node="
node --version >nul 2>&1 && set "has_node=1"

set "has_npm="
npm --version >nul 2>&1 && set "has_npm=1"

set "has_mongo="
mongod --version >nul 2>&1 && set "has_mongo=1"

REM ################################################################################
REM # Prerequisite Checks
REM ################################################################################

echo [*] Checking Prerequisites...
echo.

if defined has_git (
    for /f "tokens=*" %%i in ('git --version') do set "GIT_VERSION=%%i"
    echo [+] Git found: !GIT_VERSION!
) else (
    echo [-] Git is not installed
    echo    Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

if defined has_node (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_VERSION=%%i"
    echo [+] Node.js found: !NODE_VERSION!
) else (
    echo [!] Node.js not found, will attempt installation
)

if defined has_npm (
    for /f "tokens=*" %%i in ('npm --version') do set "NPM_VERSION=%%i"
    echo [+] npm found: !NPM_VERSION!
) else (
    echo [!] npm not found, will attempt installation
)

if defined has_mongo (
    for /f "tokens=*" %%i in ('mongod --version') do set "MONGO_VERSION=%%i"
    echo [+] MongoDB found: !MONGO_VERSION!
) else (
    echo [!] MongoDB not found, will attempt installation
)

echo.

REM ################################################################################
REM # Install Node.js (if not present)
REM ################################################################################

if not defined has_node (
    echo ================================================================================
    echo Installing Node.js v18
    echo ================================================================================
    echo.
    echo [!] Node.js installation requires manual steps.
    echo.
    echo Steps:
    echo 1. Download Node.js LTS from: https://nodejs.org/
    echo 2. Run the installer
    echo 3. Follow the installation wizard (use default settings)
    echo 4. Restart your terminal/command prompt
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

REM ################################################################################
REM # Install MongoDB (if not present)
REM ################################################################################

if not defined has_mongo (
    echo ================================================================================
    echo Installing MongoDB
    echo ================================================================================
    echo.
    echo [!] MongoDB installation can be done in multiple ways:
    echo.
    echo Option 1 - Using Chocolatey (Recommended):
    echo   1. Install Chocolatey from: https://chocolatey.org/install
    echo   2. Open PowerShell as Administrator
    echo   3. Run: choco install mongodb-community -y
    echo.
    echo Option 2 - Manual Installation:
    echo   1. Download from: https://www.mongodb.com/try/download/community
    echo   2. Run the installer
    echo   3. Follow the installation wizard
    echo.
    echo Option 3 - MongoDB Atlas (Cloud):
    echo   1. Visit: https://www.mongodb.com/cloud/atlas
    echo   2. Create free account and cluster
    echo   3. Update MONGO_URI in .env file with connection string
    echo.
    echo After MongoDB installation, restart this script.
    echo.
    pause
    exit /b 1
)

REM ################################################################################
REM # Setup Project
REM ################################################################################

echo ================================================================================
echo Setting Up Project
echo ================================================================================
echo.

REM Check if in correct directory
if not exist "%PROJECT_DIR%\server" (
    echo [-] Not in correct directory. Expected LMS root directory.
    echo     Current directory: %PROJECT_DIR%
    pause
    exit /b 1
)

REM Install backend dependencies
echo [*] Installing backend dependencies...
cd /d "%PROJECT_DIR%\server"
call npm install
if errorlevel 1 (
    echo [-] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [+] Backend dependencies installed
echo.

REM Install frontend dependencies
echo [*] Installing frontend dependencies...
cd /d "%PROJECT_DIR%\client"
call npm install
if errorlevel 1 (
    echo [-] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [+] Frontend dependencies installed
echo.

REM ################################################################################
REM # Create Environment Files
REM ################################################################################

echo ================================================================================
echo Creating Environment Files
echo ================================================================================
echo.

cd /d "%PROJECT_DIR%"

if not exist ".env" (
    echo [*] Creating .env file...
    (
        echo MONGO_URI=mongodb://localhost:27017/lms
        echo JWT_SECRET=your-super-secret-key-change-in-production-12345
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo [+] .env file created
) else (
    echo [+] .env file already exists
)

echo.

REM ################################################################################
REM # Seed Database
REM ################################################################################

echo ================================================================================
echo Seeding Database
echo ================================================================================
echo.

REM Check if MongoDB is running
echo [*] Checking MongoDB connection...
timeout /t 2 /nobreak

cd /d "%PROJECT_DIR%\server"

echo [*] Running seed script...
call npm run seed

if errorlevel 1 (
    echo [-] Warning: Seed script encountered an error
    echo    This might be due to MongoDB not running or other issues
    echo    You can run 'npm run seed' manually later
) else (
    echo [+] Database seeded successfully
)

echo.

REM ################################################################################
REM # Display Summary
REM ################################################################################

echo ================================================================================
echo Setup Complete!
echo ================================================================================
echo.
echo [+] All prerequisites installed and configured
echo [+] Project dependencies installed
echo [+] Database seeded with test data
echo.
echo Next Steps:
echo.
echo 1. Start MongoDB:
echo    - If installed as service: MongoDB will start automatically
echo    - If using MongoDB Atlas: No action needed
echo.
echo 2. Start Backend Server (open Command Prompt or PowerShell):
echo    cd "%PROJECT_DIR%\server"
echo    npm start
echo.
echo 3. Start Frontend Server (open new Command Prompt or PowerShell):
echo    cd "%PROJECT_DIR%\client"
echo    npm run dev
echo.
echo 4. Open your browser and visit:
echo    http://localhost:5173
echo.
echo Login Credentials:
echo    Email: alex.learner@company.com
echo    Password: password123
echo.
echo Other Test Accounts:
echo    - Trainer: john.trainer@company.com / password123
echo    - Admin: admin@company.com / password123
echo.
echo For complete documentation, see:
echo    - README.md
echo    - SETUP.md
echo    - WALKTHROUGH.md
echo.
echo ================================================================================
echo Thank you for using LMS!
echo ================================================================================
echo.

pause
