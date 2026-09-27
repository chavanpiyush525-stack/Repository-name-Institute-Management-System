@echo off
echo ========================================
echo Course Saving Error Diagnostic Tool
echo ========================================
echo.

echo 1. Checking if backend is running on port 8080...
netstat -an | findstr :8080
if %errorlevel% equ 0 (
    echo ✅ Port 8080 is in use (backend likely running)
) else (
    echo ❌ Port 8080 is not in use (backend not running)
    echo.
    echo SOLUTION: Start the backend server
    echo Run: cd backend/backend && mvnw.cmd spring-boot:run
    echo Or: start-system.bat
    goto :end
)

echo.
echo 2. Testing backend API endpoint...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:8080/admin/courses
if %errorlevel% equ 0 (
    echo ✅ Backend API is responding
) else (
    echo ❌ Backend API is not responding
    echo.
    echo SOLUTION: Check if backend started successfully
    echo Look for errors in the backend console
)

echo.
echo 3. Checking if frontend is running on port 4200...
netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Port 4200 is in use (frontend likely running)
) else (
    echo ❌ Port 4200 is not in use (frontend not running)
    echo.
    echo SOLUTION: Start the frontend server
    echo Run: cd frontend && npm start
    echo Or: start-system.bat
)

echo.
echo 4. Testing CORS and connectivity...
echo Testing GET request to courses endpoint...
curl -H "Origin: http://localhost:4200" -H "Content-Type: application/json" http://localhost:8080/admin/courses
echo.

echo.
echo 5. Testing POST request (create course)...
curl -X POST -H "Origin: http://localhost:4200" -H "Content-Type: application/json" -d "{\"name\":\"Test Course\",\"description\":\"Test Description\"}" http://localhost:8080/admin/courses
echo.

:end
echo.
echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If you see errors above:
echo 1. Make sure both backend and frontend are running
echo 2. Check browser console for JavaScript errors
echo 3. Verify network tab in browser dev tools
echo 4. Try the manual test URLs:
echo    - Backend: http://localhost:8080/admin/courses
echo    - Frontend: http://localhost:4200
echo.
pause