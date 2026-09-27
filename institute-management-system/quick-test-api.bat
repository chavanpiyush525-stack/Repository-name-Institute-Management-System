@echo off
echo Testing Backend API...
echo.

echo Waiting for backend to be ready...
timeout /t 5 /nobreak >nul

echo Testing GET /admin/courses...
curl -s -w "Status: %%{http_code}\n" http://localhost:8080/admin/courses
echo.

echo Testing POST /admin/courses...
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test Course\",\"description\":\"Test Description\"}" -w "Status: %%{http_code}\n" http://localhost:8080/admin/courses
echo.

echo Done!