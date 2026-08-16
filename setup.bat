@echo off
setlocal EnableDelayedExpansion
title Crisper - Setup Wizard
color 0B

echo ===============================================================================
echo                CRISPER AUDIO ENGINE - AUTOMATED SETUP
echo ===============================================================================
echo.
echo  This script will prepare all dependencies for Crisper (Backend & Frontend).
echo.

:: 1. Check Node.js Installation
echo [1/4] Checking Node.js and NPM environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Node.js is NOT installed or not added to your system PATH.
    echo Please download and install Node.js (v18+ recommended) from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] NPM is NOT found in your system PATH.
    echo Please make sure Node.js is installed properly.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo  - Found Node.js: %NODE_VERSION%
echo  - Found NPM:     v%NPM_VERSION%
echo.

:: 2. Setup Backend Dependencies
echo ===============================================================================
echo [2/4] Setting up Backend service & Playwright engine...
echo ===============================================================================
cd /d "%~dp0backend"
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Could not navigate to backend directory: "%~dp0backend"
    pause
    exit /b 1
)

if not exist "temp_downloads" (
    echo  - Creating backend\temp_downloads directory...
    mkdir "temp_downloads"
)

echo  - Installing backend npm packages...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)

echo  - Installing Playwright Chromium browser binary...
call npx playwright install chromium
if %errorlevel% neq 0 (
    color 0E
    echo [WARNING] Playwright Chromium installation encountered a warning or error.
    echo Backend will retry installing automatically when started if needed.
)
echo.

:: 3. Setup Frontend Dependencies
echo ===============================================================================
echo [3/4] Setting up Frontend (Next.js)...
echo ===============================================================================
cd /d "%~dp0frontend"
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Could not navigate to frontend directory: "%~dp0frontend"
    pause
    exit /b 1
)

echo  - Installing frontend npm packages...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b 1
)
echo.

:: 4. Final verification
echo ===============================================================================
echo [4/4] Finalizing Setup...
echo ===============================================================================
cd /d "%~dp0"
color 0A
echo.
echo ===============================================================================
echo                 SETUP COMPLETED SUCCESSFULLY!
echo ===============================================================================
echo.
echo  Backend and Frontend dependencies have been installed and configured.
echo.
echo  You can now start Crisper at any time by double-clicking:
echo    ^> run.bat
echo.
echo ===============================================================================
pause
