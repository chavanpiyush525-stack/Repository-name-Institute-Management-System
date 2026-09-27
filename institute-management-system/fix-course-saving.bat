@echo off
echo ========================================
echo Course Saving Error - Automatic Fix
echo ========================================
echo.

echo Step 1: Checking system status...
echo.

REM Check if backend is running
netstat -an | findstr :8080 >nul
if %errorlevel% neq 0 (
    echo ❌ Backend not running. Starting backend...
    echo.
    cd backend/backend
    start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"
    echo ✅ Backend server started in new window
    echo Waiting 30 seconds for backend to initialize...
    timeout /t 30 /nobreak >nul
    cd ../..
) else (
    echo ✅ Backend is already running
)

REM Check if frontend is running
netstat -an | findstr :4200 >nul
if %errorlevel% neq 0 (
    echo ❌ Frontend not running. Starting frontend...
    echo.
    cd frontend
    start "Frontend Server" cmd /k "npm start"
    echo ✅ Frontend server started in new window
    echo Waiting 20 seconds for frontend to initialize...
    timeout /t 20 /nobreak >nul
    cd ..
) else (
    echo ✅ Frontend is already running
)

echo.
echo Step 2: Testing API connectivity...
echo.

REM Test backend API
curl -s -o nul -w "Backend API Status: %%{http_code}" http://localhost:8080/admin/courses
echo.

REM Test CORS
curl -s -H "Origin: http://localhost:4200" -o nul -w "CORS Test Status: %%{http_code}" http://localhost:8080/admin/courses
echo.

echo.
echo Step 3: Creating test course to verify functionality...
echo.

curl -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:4200" -d "{\"name\":\"API Test Course\",\"description\":\"This course was created to test the API functionality\"}" http://localhost:8080/admin/courses
echo.

echo.
echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open your browser and go to: http://localhost:4200
echo 2. Navigate to Courses section
echo 3. Try creating a new course
echo 4. If you still get errors, check the browser console (F12)
echo.
echo Useful URLs:
echo - Frontend: http://localhost:4200
echo - Backend API: http://localhost:8080/admin/courses
echo - H2 Database: http://localhost:8080/h2-console
echo.
pause