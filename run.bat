@echo off
setlocal EnableDelayedExpansion
title Crisper - Studio-Grade Audio Engine Control
color 0B

cd /d "%~dp0"

:CHECK_SETUP
:: Check if node_modules exist in backend and frontend
if not exist "%~dp0backend\node_modules\" (
    goto PROMPT_SETUP
)
if not exist "%~dp0frontend\node_modules\" (
    goto PROMPT_SETUP
)
goto START_SERVICES

:PROMPT_SETUP
color 0E
echo ===============================================================================
echo               [!] INITIAL SETUP REQUIRED
echo ===============================================================================
echo.
echo Dependencies have not been installed yet.
echo Would you like to run setup.bat now? (Y/N)
echo.
set /p RUN_SETUP_CHOICE="Enter Choice [Y/N]: "
if /i "%RUN_SETUP_CHOICE%"=="Y" (
    call "%~dp0setup.bat"
    goto START_SERVICES
) else (
    echo.
    echo Please run setup.bat first before launching Crisper.
    pause
    exit /b 1
)

:START_SERVICES
cls
color 0B
echo ===============================================================================
echo                STARTING CRISPER STUDIO AUDIO ENGINE
echo ===============================================================================
echo.
echo [1/2] Launching Backend Server on port 3000...
start "Crisper Backend [Port 3000]" cmd /k "title Crisper Backend [Port 3000] && cd /d ""%~dp0backend"" && npm run dev"

echo [2/2] Launching Frontend Interface on port 5000...
start "Crisper Frontend [Port 5000]" cmd /k "title Crisper Frontend [Port 5000] && cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Initializing services, opening browser shortly...
timeout /t 3 /nobreak >nul

:: Automatically open default browser
start http://localhost:5000

:MENU
cls
color 0A
echo ===============================================================================
echo                CRISPER AUDIO ENGINE - RUNNING
echo ===============================================================================
echo.
echo   * Frontend Web UI:  http://localhost:5000
echo   * Backend REST API: http://localhost:3000
echo.
echo   Two background terminal windows have been opened for Backend and Frontend.
echo ===============================================================================
echo.
echo  Quick Actions:
echo   [1] Open Frontend UI in Web Browser
echo   [2] Open Backend API in Web Browser
echo   [3] Restart all services
echo   [4] Stop all running node servers and Exit
echo   [5] Exit this launcher window (keeps servers running in background)
echo.
set /p ACTION_CHOICE="Select an option (1-5): "

if "%ACTION_CHOICE%"=="1" (
    start http://localhost:5000
    goto MENU
)
if "%ACTION_CHOICE%"=="2" (
    start http://localhost:3000
    goto MENU
)
if "%ACTION_CHOICE%"=="3" (
    echo.
    echo Stopping running Node servers on ports 3000 and 5000...
    powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>nul
    timeout /t 1 /nobreak >nul
    goto START_SERVICES
)
if "%ACTION_CHOICE%"=="4" (
    echo.
    echo Stopping running Node servers on ports 3000 and 5000...
    powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>nul
    echo All services stopped.
    timeout /t 2 /nobreak >nul
    exit /b 0
)
if "%ACTION_CHOICE%"=="5" (
    exit /b 0
)

goto MENU
