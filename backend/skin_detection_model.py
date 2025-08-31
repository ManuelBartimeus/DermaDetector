import json
import onnxruntime as rt
import cv2
import numpy as np
import time
import os
import requests
import base64
from io import BytesIO
from PIL import Image
from pathlib import Path

# Global variable to hold the model
model_session = None

def load_model():
    """Load the ONNX model if not already loaded"""
    global model_session
    if model_session is None:
        try:
            # Model path - you'll need to download the model file
            model_path = os.path.join(os.path.dirname(__file__), "VIT23n_quantmodel.onnx")
            if not os.path.exists(model_path):
                print(f"Local model file not found at {model_path}")
                return None
            
            providers = ['CPUExecutionProvider']
            model_session = rt.InferenceSession(model_path, providers=providers)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading local model: {e}")
            model_session = None
    return model_session

def detect_with_hosted_api(img_array):
    """
    Use the hosted API as fallback when local model is not available
    """
    try:
        # Convert numpy array to PIL Image
        pil_image = Image.fromarray(img_array.astype('uint8'))
        
        # Convert to bytes
        img_byte_arr = BytesIO()
        pil_image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Prepare the request
        files = {'im': ('image.jpg', img_byte_arr, 'image/jpeg')}
        
        # Make request to hosted API
        response = requests.post(
            'https://skindiseasesdetect-2.onrender.com/detect',
            files=files,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            raise Exception(f"API request failed with status {response.status_code}")
            
    except Exception as e:
        print(f"Error with hosted API: {e}")
        raise

def skindisease_detector(img_array):
    """
    Detect skin disease from image array using ONNX model or hosted API
    
    Args:
        img_array: numpy array of the input image
    
    Returns:
        dict: Detection results with disease info
    """
    try:
        # Load skin diseases from the JSON file
        json_path = os.path.join(os.path.dirname(__file__), 'skindisease.json')
        with open(json_path, 'r') as file:
            skin_diseases = json.load(file)['skin_diseases']
        
        # Try to use local model first
        model = load_model()
        
        if model is not None:
            # Use local model
            time_init = time.time()
            
            # Preprocess image
            test_image = cv2.resize(img_array, (256, 256))
            im = np.float32(test_image)
            img_array_processed = np.expand_dims(im, axis=0)

            # Run inference
            onn_pred = model.run(['dense'], {"input_1": img_array_processed})

            time_elapsed = time.time() - time_init
            disease_index = np.argmax(onn_pred[0][0])
            confidence = float(onn_pred[0][0][disease_index])
            
            # Get disease information
            disease_info = skin_diseases[disease_index]

            return {
                "disease": disease_info['name'],
                "overview": disease_info['overview'],
                "symptoms": disease_info['symptoms'],
                "causes": disease_info['causes'],
                "treatments": disease_info['treatments'],
                "probability": confidence,
                "time": str(time_elapsed)
            }
        else:
            # Use hosted API as fallback
            print("Using hosted API as fallback...")
            time_init = time.time()
            
            api_result = detect_with_hosted_api(img_array)
            
            time_elapsed = time.time() - time_init
            
            # The hosted API returns the result in the same format
            # Add time if not present
            if 'time' not in api_result:
                api_result['time'] = str(time_elapsed)
                
            return api_result
    
    except Exception as e:
        print(f"Error in skin disease detection: {e}")
        
        # Fallback to a default response
        return {
            "disease": "Unknown/Normal",
            "overview": "Unable to detect skin condition. This may be normal skin or the image quality may not be sufficient for analysis.",
            "symptoms": ["No specific symptoms identified"],
            "causes": ["Analysis inconclusive"],
            "treatments": ["Consult a dermatologist for professional evaluation"],
            "probability": 0.0,
            "time": "0.0"
        }
