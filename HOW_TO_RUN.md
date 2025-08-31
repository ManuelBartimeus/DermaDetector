# 🚀 How to Run AI Derma Detector

This guide shows you how to run both the backend and frontend of your AI Derma Detector project.

## 📋 Prerequisites

Make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed  
- ✅ Expo CLI installed (`npm install -g @expo/cli`)
- ✅ A mobile device with Expo Go app OR an emulator

## 🔧 Setup (One-time only)

### Backend Setup
```bash
# Navigate to project root
cd AI-derma-detector

# Python dependencies should already be installed, but if not:
pip install -r backend/requirements.txt
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install
```

## 🚀 Running the Project

### Step 1: Start the Backend (Python FastAPI)

Open a terminal and run:

**Option A: Using the batch script (Windows)**
```bash
cd backend
start_server.bat
```

**Option B: Using Python directly**
```bash
cd backend
python main.py
```

**Option C: Using uvicorn for development**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

You should see:
```
INFO:     Started server process [XXXX]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:3000
```

✅ **Backend is now running on http://localhost:3000**

### Step 2: Start the Frontend (React Native/Expo)

Open a **NEW** terminal and run:

```bash
cd frontend
npm start
```

You should see:
```
Starting project at .../frontend
Starting Metro Bundler
```

✅ **Frontend development server is now running**

### Step 3: Connect Your Mobile Device

1. **Install Expo Go** on your mobile device:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Scan the QR Code:**
   - The terminal will show a QR code
   - Open Expo Go app and scan the QR code
   - The app will load on your device

**Alternative: Run on Web Browser**
```bash
# In the frontend terminal, press 'w' to open in web browser
w
```

## 🔍 Testing the Integration

### 1. Test Backend API
- Open browser: http://localhost:3000
- API Documentation: http://localhost:3000/docs
- Health Check: http://localhost:3000/health
- Supported Diseases: http://localhost:3000/supported-diseases

### 2. Test Frontend
- Open the app on your device/browser
- Navigate through the screens
- Test image upload and analysis

### 3. Test End-to-End
1. Take or upload a skin image in the app
2. Submit for analysis
3. Verify you get detailed results with:
   - Disease classification
   - Symptoms, causes, treatments
   - Confidence percentage

## 📱 Development Workflow

### Daily Development
1. **Start Backend:**
   ```bash
   cd backend && python main.py
   ```

2. **Start Frontend:**
   ```bash
   cd frontend && npm start
   ```

3. **Make Changes:**
   - Backend changes: Server auto-reloads with uvicorn --reload
   - Frontend changes: Expo hot-reloads automatically

## 🛠️ Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
netstat -ano | findstr :3000
# Kill the process using the PID shown
taskkill /PID [PID] /F
```

**Python module errors:**
```bash
# Activate virtual environment
.venv\\Scripts\\activate
# Reinstall dependencies
pip install -r requirements.txt
```

**Model not found:**
- The system will automatically use hosted API as fallback
- Check console for "Using hosted API as fallback..."

### Frontend Issues

**Expo CLI not found:**
```bash
npm install -g @expo/cli
```

**Metro bundler issues:**
```bash
# Clear cache
npm start -- --clear
```

**Network connectivity:**
- Ensure your device and computer are on the same WiFi network
- Check firewall settings

## 📊 Project Status

When both servers are running, you should see:

✅ **Backend:** http://localhost:3000 (FastAPI with ONNX model)
✅ **Frontend:** Expo development server with QR code
✅ **Integration:** App connects to Python backend for skin disease detection

## 🎯 Key Features Working

- **22 Skin Disease Classifications**
- **ONNX Vision Transformer Model**
- **Detailed Medical Information**
- **Fallback to Hosted API**
- **Real-time Image Analysis**
- **Cross-platform Mobile App**

## 📞 Quick Commands Reference

```bash
# Start backend
cd backend && python main.py

# Start frontend  
cd frontend && npm start

# Test API
curl http://localhost:3000/health

# View API docs
# Open: http://localhost:3000/docs
```

---

**🎉 You're all set! Your AI Derma Detector is now running with the integrated ONNX model.**
