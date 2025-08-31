"""
Test script for the AI Derma Detector backend integration
Tests the skin disease detection functionality
"""

import requests
import json
import os
from pathlib import Path

def test_backend_health():
    """Test if the backend is running and healthy"""
    try:
        response = requests.get('http://localhost:3000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_supported_diseases():
    """Test the supported diseases endpoint"""
    try:
        response = requests.get('http://localhost:3000/supported-diseases', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Supported diseases endpoint working")
            print(f"Total diseases supported: {data.get('total_count', 'Unknown')}")
            diseases = data.get('supported_diseases', [])
            print("Sample diseases:", diseases[:5] if diseases else "None")
            return True
        else:
            print(f"❌ Supported diseases endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing supported diseases: {e}")
        return False

def test_analyze_endpoint():
    """Test the analyze endpoint with a sample image"""
    print("\n📝 Note: To test image analysis, you need to provide an actual image file.")
    print("The backend is configured to handle image uploads via the /analyze endpoint.")
    print("You can test this using:")
    print("1. The Swagger UI at http://localhost:3000/docs")
    print("2. The frontend application")
    print("3. A manual HTTP request with multipart/form-data")
    
    # Example of how to test with an actual image file
    print("\nExample test with curl:")
    print('curl -X POST "http://localhost:3000/analyze" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "image=@your_image.jpg"')

def main():
    """Run all tests"""
    print("🧪 Testing AI Derma Detector Backend Integration")
    print("=" * 50)
    
    # Test backend connectivity
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start it first using:")
        print("   python main.py")
        print("   or")
        print("   start_server.bat")
        return
    
    print()
    
    # Test supported diseases
    test_supported_diseases()
    
    print()
    
    # Test analyze endpoint (informational)
    test_analyze_endpoint()
    
    print("\n" + "=" * 50)
    print("🎉 Backend integration test completed!")
    print("\nNext steps:")
    print("1. Test image upload via Swagger UI: http://localhost:3000/docs")
    print("2. Start the frontend application to test end-to-end")
    print("3. The backend will use hosted API as fallback if local model is unavailable")

if __name__ == "__main__":
    main()
