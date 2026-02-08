@echo off
REM ============================================
REM LearnHub LMS - Windows Setup Script
REM ============================================

echo.
echo ╔═══════════════════════════════════════════╗
echo ║     LearnHub LMS - Setup Script           ║
echo ║     Windows                               ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Check for Node.js
echo [*] Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+ first.
    echo     Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js detected

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] npm is not installed.
    pause
    exit /b 1
)
echo [OK] npm detected

REM Create .env if not exists
echo.
echo [*] Setting up environment...
if not exist ".env" (
    (
        echo MONGO_URI=mongodb://localhost:27017/lms
        echo JWT_SECRET=your-super-secret-key-change-in-production
        echo PORT=5000
    ) > .env
    echo [OK] Created .env file
) else (
    echo [OK] .env file already exists
)

REM Install backend dependencies
echo.
echo [*] Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% neq 0 (
    echo [X] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Install frontend dependencies
echo.
echo [*] Installing frontend dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% neq 0 (
    echo [X] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

REM Go back to root
cd ..

REM Offer to seed database
echo.
set /p SEED_CHOICE="[?] Would you like to seed the database with demo data? (y/n): "
if /i "%SEED_CHOICE%"=="y" (
    echo Seeding database...
    cd server
    call npm run seed
    cd ..
    echo [OK] Database seeded with demo data
)

REM Done
echo.
echo ╔═══════════════════════════════════════════╗
echo ║     [OK] Setup Complete!                  ║
echo ╚═══════════════════════════════════════════╝
echo.
echo To start the application:
echo.
echo   Terminal 1 (Backend):
echo     cd server ^&^& npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     cd client ^&^& npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Demo login: admin@company.com / password123
echo.
pause
