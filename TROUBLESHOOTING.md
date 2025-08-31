# 🔧 Troubleshooting Network Error

## ❌ Error: "Network error: No response from server"

This error occurs when the frontend React Native app cannot connect to the Python backend server.

## ✅ **Step-by-Step Solution**

### **Step 1: Verify Backend is Running**

1. **Check if backend is running:**
   ```bash
   # Open PowerShell/Terminal
   netstat -ano | findstr :3000
   ```
   
   - If you see output with port 3000, the backend is running
   - If no output, the backend is not running

2. **Start the backend if not running:**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Start the server
   python main.py
   # OR use the batch script
   start_server.bat
   ```

3. **Verify backend responds:**
   - Open browser: http://localhost:3000
   - Should show: `{"message": "AI Derma Detector API...", "status": "running"}`

### **Step 2: Fix Port Conflicts**

If you get "port already in use" error:

```bash
# Find processes using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with actual PID)
taskkill /PID XXXX /F

# Restart backend
python main.py
```

### **Step 3: Test Backend API**

Test these endpoints in your browser:
- ✅ Health: http://localhost:3000/health
- ✅ API Docs: http://localhost:3000/docs
- ✅ Diseases: http://localhost:3000/supported-diseases

### **Step 4: Check Network Configuration**

For React Native/Expo development:

1. **Same WiFi Network:**
   - Ensure your computer and mobile device are on the same WiFi network

2. **Firewall Settings:**
   - Windows Firewall might block the connection
   - Allow Python through Windows Firewall

3. **Alternative Backend URL:**
   If localhost doesn't work, try your computer's IP address:
   
   ```bash
   # Find your computer's IP address
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter
   ```
   
   Then update `skinDetectionService.js`:
   ```javascript
   // Replace localhost with your IP address
   const BACKEND_API_URL = 'http://192.168.1.XXX:3000';
   ```

### **Step 5: Debug the Frontend**

The updated service now includes better debugging. Check the console logs:

```javascript
// In your React Native app console, you should see:
🔍 Starting skin disease detection...
📷 Image URI: ...
🌐 Backend URL: http://localhost:3000
🔍 Checking backend connectivity...
✅ Backend is reachable: {status: "healthy"}
📦 Form data created successfully
✅ Backend response received: 200
🎉 Detection successful: Acne
```

## 🚀 **Quick Fix Commands**

Run these commands in order:

```bash
# 1. Kill any existing backend processes
taskkill /F /IM python.exe

# 2. Navigate to backend
cd "C:\Users\manue\Desktop\projects\AI-derma-detector\backend"

# 3. Start backend
python main.py

# 4. In another terminal, test the API
curl http://localhost:3000/health

# 5. Start frontend (in another terminal)
cd "../frontend"
npm start
```

## 🔍 **Common Issues & Solutions**

### Issue 1: "Module not found" errors
```bash
# Activate virtual environment
.venv\\Scripts\\activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 2: Backend starts but immediately exits
```bash
# Check for syntax errors
python -m py_compile main.py
# Check dependencies
pip list
```

### Issue 3: "Connection refused" in Expo
- Try using your computer's IP instead of localhost
- Check if Windows Firewall is blocking the connection
- Restart both backend and frontend

### Issue 4: CORS errors
- The backend already includes CORS middleware
- If still getting CORS errors, check if you're using the correct URL

## 📱 **Testing End-to-End**

1. **Backend Test:**
   ```bash
   curl -X POST "http://localhost:3000/analyze" \
        -H "Content-Type: multipart/form-data" \
        -F "image=@test_image.jpg"
   ```

2. **Frontend Test:**
   - Use the updated service with better error handling
   - Check console logs for detailed debugging info

## 🆘 **Still Having Issues?**

If the problem persists:

1. **Check Backend Logs:**
   - Look at the terminal where the backend is running
   - Check for error messages

2. **Check Frontend Logs:**
   - Open React Native debugger
   - Check console for detailed error messages

3. **Network Debugging:**
   ```bash
   # Test if port is accessible
   telnet localhost 3000
   # Or use PowerShell
   Test-NetConnection -ComputerName localhost -Port 3000
   ```

---

**🎯 Expected Result:** Your app should now successfully connect to the backend and analyze skin images with detailed medical information!
