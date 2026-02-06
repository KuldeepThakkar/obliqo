@echo off
echo ========================================
echo   ApplyLess - Backend Setup
echo ========================================
echo.

cd backend

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error creating virtual environment!
    pause
    exit /b 1
)
echo Virtual environment created!
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error activating virtual environment!
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

echo Installing dependencies...
pip install -r requirements.txt
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
echo To start the backend server, run:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload
echo.
pause
