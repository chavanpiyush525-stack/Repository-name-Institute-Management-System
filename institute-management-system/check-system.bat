@echo off
echo Checking system requirements...
echo.

echo Checking Java...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found. Please install Java 17+
    echo Download from: https://adoptium.net/
    echo.
) else (
    echo Java: OK
    echo.
)

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 16+
    echo Download from: https://nodejs.org/
    echo.
) else (
    echo Node.js: OK
    echo.
)

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found. Please install Node.js (includes npm)
    echo.
) else (
    echo npm: OK
    echo.
)

echo Checking frontend dependencies...
if exist "frontend\node_modules" (
    echo Frontend dependencies: OK
) else (
    echo Frontend dependencies: NOT INSTALLED
    echo Run 'setup.bat' to install dependencies
)
echo.

echo Checking backend...
if exist "backend\backend\mvnw.cmd" (
    echo Backend Maven wrapper: OK
) else (
    echo Backend Maven wrapper: NOT FOUND
)
echo.

echo System check complete!
echo.
pause