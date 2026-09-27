# 🔧 Course Saving Error - Step-by-Step Fix Guide

## 🚨 **Quick Fix (Try This First)**

1. **Run the automatic fix script:**
   ```bash
   fix-course-saving.bat
   ```

2. **If that doesn't work, follow the manual steps below:**

---

## 📋 **Manual Troubleshooting Steps**

### **Step 1: Verify Backend is Running**

1. **Check if backend is running:**
   ```bash
   netstat -an | findstr :8080
   ```
   - If you see output, backend is running ✅
   - If no output, backend is not running ❌

2. **Start backend if not running:**
   ```bash
   cd backend/backend
   mvnw.cmd spring-boot:run
   ```

3. **Wait for this message:**
   ```
   Started InstituteBackendApplication in X.XXX seconds
   Tomcat started on port(s): 8080 (http)
   ```

### **Step 2: Test Backend API**

1. **Open browser and go to:**
   ```
   http://localhost:8080/admin/courses
   ```
   - Should show `[]` or list of courses ✅
   - If error page, backend has issues ❌

2. **Test with command line:**
   ```bash
   test-backend.bat
   ```

### **Step 3: Verify Frontend is Running**

1. **Check if frontend is running:**
   ```bash
   netstat -an | findstr :4200
   ```

2. **Start frontend if not running:**
   ```bash
   cd frontend
   npm start
   ```

3. **Open browser and go to:**
   ```
   http://localhost:4200
   ```

### **Step 4: Check Browser Console**

1. **Open Developer Tools (F12)**
2. **Go to Console tab**
3. **Try creating a course**
4. **Look for error messages**

**Common errors and solutions:**

| Error Message | Solution |
|---------------|----------|
| `net::ERR_CONNECTION_REFUSED` | Backend not running - start backend |
| `CORS policy blocked` | CORS issue - check backend CORS config |
| `404 Not Found` | Wrong API URL or endpoint missing |
| `400 Bad Request` | Invalid data - check form validation |
| `500 Internal Server Error` | Backend error - check backend logs |

### **Step 5: Check Network Tab**

1. **In Developer Tools, go to Network tab**
2. **Try creating a course**
3. **Look for failed requests (red entries)**
4. **Click on failed request to see details**

### **Step 6: Verify CORS Configuration**

1. **Check AdminController.java has:**
   ```java
   @CrossOrigin(origins = "http://localhost:4200")
   ```

2. **Test CORS manually:**
   ```bash
   curl -H "Origin: http://localhost:4200" http://localhost:8080/admin/courses
   ```

---

## 🔍 **Advanced Diagnostics**

### **Run Full Diagnostic:**
```bash
diagnose-course-error.bat
```

### **Check H2 Database:**
1. Go to: http://localhost:8080/h2-console
2. Use these settings:
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)
3. Click "Connect"
4. Run: `SELECT * FROM COURSE;`

### **Check Backend Logs:**
Look at the terminal where you ran `mvnw.cmd spring-boot:run` for error messages.

---

## 🛠 **Common Solutions**

### **Solution 1: Restart Everything**
```bash
# Stop all processes (Ctrl+C in terminals)
# Then run:
start-system.bat
```

### **Solution 2: Clear Browser Cache**
- Hard refresh: `Ctrl+Shift+R`
- Clear cache and cookies
- Try incognito/private mode

### **Solution 3: Check Firewall**
- Ensure ports 8080 and 4200 are not blocked
- Temporarily disable firewall to test

### **Solution 4: Reinstall Dependencies**
```bash
cd frontend
npm install
```

### **Solution 5: Use Different Ports**
If ports are in use by other applications:

**Backend (application.properties):**
```properties
server.port=8081
```

**Frontend (course.service.ts):**
```typescript
private apiUrl = 'http://localhost:8081/admin/courses';
```

---

## ✅ **Verification Steps**

After applying fixes:

1. **Backend Test:**
   ```bash
   curl http://localhost:8080/admin/courses
   ```
   Should return JSON array

2. **Frontend Test:**
   - Go to http://localhost:4200/courses/new
   - Fill form and submit
   - Should redirect with success message

3. **End-to-End Test:**
   - Create a course via UI
   - Check it appears in course list
   - Edit the course
   - Delete the course

---

## 🆘 **Still Having Issues?**

### **Collect Debug Information:**

1. **Browser Console Errors** (F12 → Console)
2. **Network Requests** (F12 → Network)
3. **Backend Logs** (terminal output)
4. **System Information:**
   ```bash
   java -version
   node --version
   npm --version
   ```

### **Try Alternative Testing:**

1. **Use Postman or curl to test API directly**
2. **Test with different browser**
3. **Check if antivirus is blocking connections**

### **Reset to Clean State:**

1. **Stop all servers**
2. **Delete node_modules and reinstall:**
   ```bash
   cd frontend
   rmdir /s node_modules
   npm install
   ```
3. **Clean backend:**
   ```bash
   cd backend/backend
   mvnw.cmd clean
   ```
4. **Restart everything:**
   ```bash
   start-system.bat
   ```

---

## 🎯 **Expected Working State**

When everything is working correctly:

1. ✅ Backend runs on http://localhost:8080
2. ✅ Frontend runs on http://localhost:4200
3. ✅ API responds at http://localhost:8080/admin/courses
4. ✅ Course form submits without errors
5. ✅ Success message appears after course creation
6. ✅ New course appears in course list

---

## 📞 **Additional Resources**

- **Backend API Documentation:** Check AdminController.java
- **Frontend Service:** Check course.service.ts
- **Database Console:** http://localhost:8080/h2-console
- **System Requirements:** Java 17+, Node.js 16+

If you've followed all steps and still have issues, the problem might be environment-specific (firewall, antivirus, network configuration, etc.).