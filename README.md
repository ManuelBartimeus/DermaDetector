# AI Derma Detector

An advanced skin disease detection application using a Vision Transformer (ViT) ONNX model, replacing the previous Roboflow API implementation with an open-source solution.

## 🎯 Overview

This project has been updated to integrate an open-source AI skin detection model from [pacificrm/skinDiseasesDetection](https://github.com/pacificrm/skinDiseasesDetection). The application can now detect 22 different skin conditions using a quantized Vision Transformer model.

## 🔄 Recent Changes

### Backend Migration
- **From**: Node.js with OpenAI API
- **To**: Python FastAPI with ONNX Vision Transformer model
- **Benefits**: 
  - More accurate medical predictions
  - 22 specific skin disease classes
  - Open-source and self-hosted
  - Detailed medical information (symptoms, causes, treatments)

### Frontend Updates
- Updated service to connect to new Python backend
- Enhanced response format with medical details
- Better error handling and fallback mechanisms

## 🏗️ Architecture

```
AI-Derma-Detector/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── skin_detection_model.py  # ONNX model inference
│   ├── schemas.py          # Response models
│   ├── skindisease.json    # Disease information database
│   ├── requirements.txt    # Python dependencies
│   └── start_server.bat    # Windows startup script
│
├── frontend/               # React Native frontend
│   ├── src/
│   │   ├── services/
│   │   │   ├── skinDetectionService.js  # NEW: Backend API service
│   │   │   └── roboflowService.js       # OLD: Roboflow service
│   │   └── screens/
│   │       └── PreviewScreen.js         # Updated to use new service
│   └── package.json
│
└── .venv/                  # Python virtual environment
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies (virtual environment should be configured)
pip install -r requirements.txt

# Start the server
python main.py
# OR use the batch script on Windows
start_server.bat
```

The backend will start on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Start the React Native app (follow standard React Native setup)
npm start
```

### 3. Verify Integration

1. **Backend Health Check**: Visit `http://localhost:3000/health`
2. **API Documentation**: Visit `http://localhost:3000/docs`
3. **Test Detection**: Use the Swagger UI to upload a test image

## 🩺 Supported Skin Diseases

The model can detect and classify 22 skin conditions:

1. **Acne** - Common inflammatory skin condition
2. **Actinic Keratosis** - Precancerous skin patches from sun damage
3. **Benign Tumors** - Non-cancerous skin growths
4. **Bullous** - Blistering skin conditions
5. **Candidiasis** - Fungal infections
6. **Drug Eruption** - Medication-induced skin reactions
7. **Eczema** - Inflammatory skin condition with itching
8. **Infestations/Bites** - Parasitic infections and insect bites
9. **Lichen** - Inflammatory skin and mucous membrane condition
10. **Lupus** - Autoimmune disease skin manifestations
11. **Moles** - Pigmented skin lesions
12. **Psoriasis** - Autoimmune scaling skin condition
13. **Rosacea** - Facial redness and inflammation
14. **Seborrheic Keratoses** - Common benign skin growths
15. **Skin Cancer** - Malignant skin lesions
16. **Sun/Sunlight Damage** - UV-induced skin damage
17. **Tinea** - Fungal skin infections (ringworm)
18. **Unknown/Normal** - Unidentifiable or normal skin
19. **Vascular Tumors** - Blood vessel-related growths
20. **Vasculitis** - Blood vessel inflammation
21. **Vitiligo** - Loss of skin pigmentation
22. **Warts** - Viral skin growths

## 🔧 Technical Details

### Backend API Endpoints

- `GET /` - API information
- `POST /analyze` - Main detection endpoint (multipart/form-data)
- `GET /health` - Health check
- `GET /supported-diseases` - List of supported diseases
- `GET /docs` - Interactive API documentation

### Model Information

- **Architecture**: Vision Transformer (ViT)
- **Optimization**: Quantized with ONNX
- **Input Size**: 256×256 pixels
- **Framework**: ONNXRuntime for inference
- **Fallback**: Hosted API when local model unavailable

### Response Format

```json
{
  "success": true,
  "result": {
    "disease": "Acne",
    "overview": "Detailed medical description...",
    "symptoms": ["Whiteheads", "Blackheads", "..."],
    "causes": ["Excess oil production", "..."],
    "treatments": ["Topical retinoids", "..."],
    "probability": 0.85,
    "time": "0.123"
  },
  "message": "Detection completed successfully"
}
```

## 🔄 Migration from Roboflow

### What Changed
1. **Detection Service**: `roboflowService.js` → `skinDetectionService.js`
2. **API Backend**: Node.js Express → Python FastAPI
3. **Model**: Roboflow API → Local ONNX Vision Transformer
4. **Response Format**: Enhanced with medical details

### Backward Compatibility
- Frontend interface remains the same
- Response structure is enhanced but compatible
- Old service files are preserved for reference

## 🛠️ Development

### Adding New Diseases
1. Update `skindisease.json` with new disease information
2. Retrain the ONNX model with new classes
3. Update the disease count in documentation

### Customizing Responses
- Modify `schemas.py` for response structure
- Update `skin_detection_model.py` for detection logic
- Enhance `skinDetectionService.js` for frontend processing

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_integration.py
```

### Manual Testing
1. Start backend: `python main.py`
2. Open Swagger UI: `http://localhost:3000/docs`
3. Upload test image via `/analyze` endpoint
4. Verify response format and content

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Find process using port 3000
   netstat -ano | findstr :3000
   # Kill the process
   taskkill /PID <process_id> /F
   ```

2. **Python module import errors**
   ```bash
   # Activate virtual environment
   .venv\Scripts\activate
   # Reinstall dependencies
   pip install -r requirements.txt
   ```

3. **Model file not found**
   - The system automatically uses hosted API as fallback
   - Check console for "Using hosted API as fallback..." message
   - Contact original repository for ONNX model file

4. **Frontend connection errors**
   - Ensure backend is running on port 3000
   - Check network connectivity
   - Verify CORS configuration

## 📄 License

This project integrates the open-source skin disease detection model from [pacificrm/skinDiseasesDetection](https://github.com/pacificrm/skinDiseasesDetection).

## 🙏 Credits

- **Original Model**: [Prashant Kumar Mishra (pacificrm)](https://github.com/pacificrm)
- **Repository**: https://github.com/pacificrm/skinDiseasesDetection
- **Dataset**: [Skin Disease Dataset on Kaggle](https://www.kaggle.com/datasets/pacificrm/skindiseasedataset)
- **Model Architecture**: Vision Transformer (ViT) with ONNX quantization

## 🔮 Future Enhancements

1. **Local Model Download**: Automated ONNX model download
2. **Model Updates**: Periodic model version updates
3. **Additional Features**: Confidence thresholds, batch processing
4. **Performance**: GPU acceleration support
5. **Analytics**: Usage statistics and accuracy tracking

---

**Note**: This implementation prioritizes medical accuracy and detailed information while maintaining the original user experience. The system gracefully falls back to the hosted API when the local model is unavailable, ensuring continuous functionality.
