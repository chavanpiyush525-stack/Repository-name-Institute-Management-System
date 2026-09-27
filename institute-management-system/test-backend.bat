@echo off
echo Testing Backend API...
echo.

echo 1. Testing GET /admin/courses
echo ================================
curl -s http://localhost:8080/admin/courses
echo.
echo.

echo 2. Testing POST /admin/courses (Create Course)
echo ===============================================
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test Course API\",\"description\":\"Testing course creation via API\"}" http://localhost:8080/admin/courses
echo.
echo.

echo 3. Testing GET /admin/courses again (should show new course)
echo ============================================================
curl -s http://localhost:8080/admin/courses
echo.
echo.

echo If you see JSON responses above, the backend is working correctly.
echo If you see errors, the backend may not be running or there's a configuration issue.
echo.
pause