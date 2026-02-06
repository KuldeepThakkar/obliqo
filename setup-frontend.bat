@echo off
echo ========================================
echo   ApplyLess - Frontend Setup
echo ========================================
echo.

cd frontend

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error installing dependencies!
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the frontend server, run:
echo   cd frontend
echo   npm run dev
echo.
pause
