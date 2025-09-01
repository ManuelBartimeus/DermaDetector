#!/usr/bin/env python3
"""
Secure startup script for DermaDetect backend
This script validates configuration before starting the server.
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

def check_environment():
    """Check if environment is properly configured"""
    load_dotenv()
    
    # Check if API key is configured
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or api_key == "your-openai-api-key-here":
        print("❌ ERROR: OpenAI API key is not properly configured!")
        print("Please set OPENAI_API_KEY in your .env file.")
        print("Run 'python validate_config.py' for detailed configuration check.")
        return False
    
    print("✅ Environment configuration looks good")
    return True

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting DermaDetect backend server...")
    
    try:
        # Use uvicorn to start the server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "3000",
            "--reload"
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🔧 DermaDetect Backend - Secure Startup")
    print("=" * 40)
    
    # Change to backend directory if not already there
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Validate environment
    if not check_environment():
        print("\n💡 Run 'python validate_config.py' to check your configuration.")
        sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
