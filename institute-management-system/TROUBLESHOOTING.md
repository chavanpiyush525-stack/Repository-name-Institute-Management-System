# Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend Dependencies Not Found

**Problem:** Angular modules cannot be found (e.g., `Cannot find module '@angular/core'`)

**Solution:**
1. Run `setup.bat` to install dependencies
2. Or manually: `cd frontend && npm install`
3. Ensure Node.js and npm are installed: https://nodejs.org/

### 2. Backend Won't Start

**Problem:** Maven or Java issues

**Solutions:**
- Ensure Java 17+ is installed
- Check if Maven wrapper exists: `backend/backend/mvnw.cmd`
- Try: `cd backend/backend && mvnw.cmd clean install`

### 3. TypeScript Strict Mode Errors

**Problem:** Implicit any type errors

**Solution:** The code has been updated with proper type annotations. If you still see errors:
1. Run `npm install` in the frontend directory
2. Restart your IDE/editor
3. Clear TypeScript cache if needed

### 4. Port Already in Use

**Problem:** Port 8080 or 4200 already in use

**Solutions:**
- Backend (8080): Kill the process or change port in `application.properties`
- Frontend (4200): Kill the process or use `ng serve --port 4201`

### 5. CORS Issues

**Problem:** Frontend can't connect to backend

**Solution:** The backend is configured with CORS for `http://localhost:4200`. If using different ports, update the `@CrossOrigin` annotation in `AdminController.java`.

### 6. Database Issues

**Problem:** H2 database errors

**Solutions:**
- Check H2 console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

### 7. Build Errors

**Problem:** Compilation errors

**Solutions:**
- Frontend: `cd frontend && npm run build`
- Backend: `cd backend/backend && mvnw.cmd clean compile`

## Quick Setup Commands

```bash
# Complete setup
setup.bat

# Manual setup
cd frontend
npm install
cd ../backend/backend
mvnw.cmd clean install

# Start services
start-system.bat

# Or manually
cd backend/backend && mvnw.cmd spring-boot:run
cd frontend && npm start
```

## System Requirements

- **Java:** 17 or higher
- **Node.js:** 16 or higher
- **npm:** 8 or higher
- **Ports:** 8080 (backend), 4200 (frontend)

## Verification Steps

1. **Backend:** Visit http://localhost:8080/admin/courses
2. **Frontend:** Visit http://localhost:4200
3. **Database:** Visit http://localhost:8080/h2-console

If issues persist, check the console logs for specific error messages.