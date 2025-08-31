from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from io import BytesIO
import numpy as np
import os
import uvicorn
import time
from skin_detection_model import skindisease_detector
from schemas import APIOutput, DetectionResponse, DetailedAnalysis
from openai_service import openai_service

# Create FastAPI app
app = FastAPI(title="AI Derma Detector", description="Skin Disease Detection API using ONNX Model", version="1.0.0")

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request details
    print(f"📥 {request.method} {request.url}")
    print(f"📋 Headers: {dict(request.headers)}")
    print(f"🔍 Content-Type: {request.headers.get('content-type', 'Not specified')}")
    
    # For multipart requests, log additional info
    if request.headers.get('content-type', '').startswith('multipart/form-data'):
        print(f"📦 Multipart form data detected")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    print(f"⏱️ Request completed in {process_time:.2f}s with status {response.status_code}")
    print("─" * 50)
    
    return response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Derma Detector API - Skin Disease Detection using ONNX Model", "status": "running"}

@app.post("/analyze", response_model=DetectionResponse)
async def analyze_skin_image(image: UploadFile = File(..., description="Skin image file to analyze")):
    """
    Analyze uploaded skin image for disease detection
    """
    try:
        # Log the received file for debugging
        print(f"📥 Received file: {image.filename}, content_type: {image.content_type}, size: {image.size}")
        
        # Validate file type
        if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(status_code=415, detail="Unsupported file type. Please upload PNG, JPG, or JPEG images.")
            raise HTTPException(status_code=415, detail="Unsupported file type. Please upload PNG, JPG, or JPEG images.")
        
        # Read and process image
        try:
            image_bytes = await image.read()
            pil_image = Image.open(BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
            
            # Convert PIL image to numpy array
            img_array = np.array(pil_image)
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        # Run skin disease detection
        try:
            detection_result = skindisease_detector(img_array)
            
            # Generate detailed analysis using OpenAI
            condition = detection_result.get('disease', '')
            confidence = detection_result.get('probability', 0.0)
            basic_advice = ', '.join(detection_result.get('treatments', []))
            
            print(f"🤖 Generating detailed analysis for {condition} with OpenAI...")
            detailed_analysis_dict = openai_service.generate_detailed_analysis(condition, confidence, basic_advice)
            
            # Convert to Pydantic model
            detailed_analysis = DetailedAnalysis(**detailed_analysis_dict)
            
            # Add detailed analysis to the result
            detection_result['detailed_analysis'] = detailed_analysis
            
            # Format the response
            api_output = APIOutput(**detection_result)
            
            return DetectionResponse(
                success=True,
                result=api_output,
                message="Skin disease detection completed successfully"
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/test-openai")
async def test_openai():
    """Test OpenAI integration endpoint"""
    try:
        # Test with sample data
        test_condition = "acne"
        test_confidence = 0.85
        test_advice = "Use gentle cleanser twice daily"
        
        result = openai_service.generate_detailed_analysis(test_condition, test_confidence, test_advice)
        
        return {
            "success": True,
            "message": "OpenAI integration test successful",
            "sample_analysis": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "OpenAI integration test failed"
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running properly"}

@app.get("/supported-diseases")
async def get_supported_diseases():
    """Get list of supported skin diseases"""
    try:
        import json
        json_path = os.path.join(os.path.dirname(__file__), 'skindisease.json')
        with open(json_path, 'r') as file:
            skin_diseases = json.load(file)['skin_diseases']
        
        disease_list = [disease['name'] for disease in skin_diseases]
        return {"supported_diseases": disease_list, "total_count": len(disease_list)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load disease list: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
