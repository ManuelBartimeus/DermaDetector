@echo off
echo Starting AI Derma Detector Backend...
echo.

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "..\\.venv\\Scripts\\python.exe" (
    echo Error: Virtual environment not found!
    echo Please run setup first by following the README instructions.
    pause
    exit /b 1
)

REM Start the FastAPI server
echo Starting FastAPI server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

"..\.venv\Scripts\python.exe" main.py

pause
