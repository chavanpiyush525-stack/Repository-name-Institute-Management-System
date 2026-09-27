@echo off
echo Setting up Institute Management System...
echo.

echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    echo.
    echo Please ensure Node.js and npm are installed:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
cd ..

echo.
echo Setup completed successfully!
echo.
echo To start the system:
echo 1. Run start-system.bat to start both backend and frontend
echo 2. Or manually:
echo    - Backend: cd backend/backend ^&^& mvnw.cmd spring-boot:run
echo    - Frontend: cd frontend ^&^& npm start
echo.
echo Access the application at: http://localhost:4200
echo Backend API at: http://localhost:8080
echo H2 Database Console: http://localhost:8080/h2-console
echo.
echo Note: Make sure you have Java 17+ and Node.js installed
echo.
pause