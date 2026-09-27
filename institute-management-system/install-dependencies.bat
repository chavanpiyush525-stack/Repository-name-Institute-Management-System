@echo off
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo You can now run the system using start-system.bat
pause