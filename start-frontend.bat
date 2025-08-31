@echo off
echo ========================================
echo AI Derma Detector - Frontend Startup
echo ========================================
echo.

echo Step 2: Starting Frontend (React Native/Expo)
echo =============================================
cd /d "%~dp0frontend"
echo Current directory: %CD%
echo.
echo Starting Expo development server...
echo.
echo Options after startup:
echo - Press 'w' to open in web browser
echo - Press 'a' to open Android emulator
echo - Scan QR code with Expo Go app on mobile device
echo.
npx expo start
pause
