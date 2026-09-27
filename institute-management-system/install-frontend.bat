@echo off
echo Installing frontend dependencies...
echo.

cd frontend
echo Current directory: %CD%

echo.
echo Cleaning any existing installations...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo You can now start the frontend with:
    echo   cd frontend
    echo   npm start
) else (
    echo.
    echo ❌ Installation failed. Please check the error above.
    echo.
    echo Make sure you have Node.js installed:
    echo https://nodejs.org/
)

echo.
pause