# AI Derma Detector - Backend

This backend uses a Python FastAPI server with an ONNX-based Vision Transformer model for skin disease detection, replacing the previous Roboflow API implementation.

## Features

- **22 Skin Disease Classes**: Detects various skin conditions including acne, eczema, psoriasis, skin cancer, and more
- **ONNX Model**: Uses an optimized Vision Transformer model for fast inference
- **Fallback API**: Automatically uses hosted API when local model is unavailable
- **RESTful API**: FastAPI-based endpoints with automatic documentation
- **Detailed Results**: Provides disease overview, symptoms, causes, and treatments

## Setup Instructions

### 1. Python Environment Setup

The Python virtual environment should already be configured. If not, run:

```bash
# From the project root directory
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r backend/requirements.txt
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Download Model (Optional)

The system will work with the hosted API as fallback, but for better performance, you can:

1. Contact the original repository owner at https://github.com/pacificrm/skinDiseasesDetection
2. Request the `VIT23n_quantmodel.onnx` file
3. Place it in the `backend/` directory

### 4. Start the Server

#### Option A: Using the batch script (Windows)
```bash
# Double-click or run:
start_server.bat
```

#### Option B: Using Python directly
```bash
cd backend
python main.py
```

#### Option C: Using uvicorn for development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

## API Endpoints

- `GET /` - Root endpoint with API information
- `POST /analyze` - Main skin disease detection endpoint
- `GET /health` - Health check endpoint
- `GET /supported-diseases` - List of supported diseases
- `GET /docs` - Interactive API documentation (Swagger UI)

## Usage

### Testing the API

1. Start the server
2. Open http://localhost:3000/docs in your browser
3. Use the interactive interface to test image uploads

### Frontend Integration

The frontend has been updated to use this new backend service. Make sure:

1. Backend is running on port 3000
2. Frontend service points to the correct backend URL
3. CORS is properly configured (already done)

## Model Information

- **Architecture**: Vision Transformer (ViT)
- **Optimization**: Quantized with ONNX for faster inference
- **Input Size**: 256x256 pixels
- **Classes**: 22 different skin conditions
- **Fallback**: Uses hosted API at https://skindiseasesdetect-2.onrender.com when local model unavailable

## Supported Skin Diseases

1. Acne
2. Actinic Keratosis
3. Benign Tumors
4. Bullous
5. Candidiasis
6. Drug Eruption
7. Eczema
8. Infestations/Bites
9. Lichen
10. Lupus
11. Moles
12. Psoriasis
13. Rosacea
14. Seborrheic Keratoses
15. Skin Cancer
16. Sun/Sunlight Damage
17. Tinea
18. Unknown/Normal
19. Vascular Tumors
20. Vasculitis
21. Vitiligo
22. Warts

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - Kill existing processes: `netstat -ano | findstr :3000`
   - Or change port in `main.py`

2. **Module import errors**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **Model not found**
   - The system will automatically use the hosted API
   - Check console for "Using hosted API as fallback..." message

4. **CORS errors from frontend**
   - Ensure backend is running on port 3000
   - Check that CORS middleware is properly configured

## Development

### File Structure
```
backend/
├── main.py                 # FastAPI application
├── skin_detection_model.py # ONNX model inference logic
├── schemas.py              # Pydantic models
├── skindisease.json       # Disease information database
├── requirements.txt       # Python dependencies
├── start_server.bat       # Windows startup script
└── download_model.py      # Model download utility
```

### Adding New Features

1. Model endpoints: Modify `main.py`
2. Detection logic: Update `skin_detection_model.py`
3. Response schemas: Edit `schemas.py`
4. Disease information: Update `skindisease.json`

## Credits

This implementation is based on the open-source skin disease detection model from:
- **Repository**: https://github.com/pacificrm/skinDiseasesDetection
- **Author**: Prashant Kumar Mishra (pacificrm)
- **Model**: Vision Transformer quantized with ONNX
