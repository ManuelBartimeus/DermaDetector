@echo off
echo ========================================
echo AI Derma Detector - Quick Start Guide
echo ========================================
echo.

echo Step 1: Starting Backend (Python FastAPI)
echo ========================================
cd /d "%~dp0backend"
echo Current directory: %CD%
echo.
echo Starting Python backend server...
echo Note: Make sure you have activated the Python virtual environment
echo.
python main.py
pause
