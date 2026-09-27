@echo off
echo Starting Institute Management System...
echo.

echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd backend\backend && mvnw.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Installing Frontend Dependencies...
cd frontend
if not exist node_modules (
    echo Installing npm packages...
    npm install
)
cd ..

echo Starting Frontend (Angular)...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo System is starting up...
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:4200
echo.
pause