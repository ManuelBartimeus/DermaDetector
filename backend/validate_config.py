#!/usr/bin/env python3
"""
Configuration validation script for DermaDetect backend
This script helps validate that all required environment variables are properly set.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def check_env_file():
    """Check if .env file exists and load it"""
    env_path = Path('.env')
    env_example_path = Path('.env.example')
    
    if not env_path.exists():
        print("❌ .env file not found!")
        if env_example_path.exists():
            print("💡 Found .env.example file. Please copy it to .env and set your values:")
            print(f"   cp {env_example_path} {env_path}")
        else:
            print("💡 Please create a .env file with the required environment variables.")
        return False
    
    print("✅ .env file found")
    load_dotenv()
    return True

def validate_openai_config():
    """Validate OpenAI configuration"""
    print("\n🔍 Validating OpenAI Configuration...")
    
    api_key = os.getenv('OPENAI_API_KEY')
    base_url = os.getenv('OPENAI_BASE_URL')
    model = os.getenv('OPENAI_MODEL')
    
    issues = []
    
    # Check API key
    if not api_key:
        issues.append("❌ OPENAI_API_KEY is not set")
    elif api_key == "your-openai-api-key-here":
        issues.append("❌ OPENAI_API_KEY is still set to the example value")
    elif len(api_key.strip()) < 20:
        issues.append("❌ OPENAI_API_KEY appears to be too short")
    else:
        # Don't print the actual key for security
        print(f"✅ OPENAI_API_KEY is set (length: {len(api_key)} characters)")
    
    # Check base URL
    if not base_url:
        issues.append("❌ OPENAI_BASE_URL is not set")
    else:
        print(f"✅ OPENAI_BASE_URL: {base_url}")
    
    # Check model
    if not model:
        issues.append("❌ OPENAI_MODEL is not set")
    else:
        print(f"✅ OPENAI_MODEL: {model}")
    
    return issues

def validate_server_config():
    """Validate server configuration"""
    print("\n🔍 Validating Server Configuration...")
    
    host = os.getenv('HOST', '0.0.0.0')
    port = os.getenv('PORT', '3000')
    debug = os.getenv('DEBUG', 'False')
    
    print(f"✅ HOST: {host}")
    print(f"✅ PORT: {port}")
    print(f"✅ DEBUG: {debug}")
    
    return []

def test_openai_connection():
    """Test if OpenAI service can be initialized"""
    print("\n🔍 Testing OpenAI Service Initialization...")
    
    try:
        # Import here to avoid circular imports
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from openai_service import openai_service
        
        if openai_service._is_configured():
            print("✅ OpenAI service is properly configured")
            return []
        else:
            return ["❌ OpenAI service configuration is invalid"]
    except Exception as e:
        return [f"❌ Failed to initialize OpenAI service: {type(e).__name__}"]

def main():
    """Main validation function"""
    print("🔧 DermaDetect Backend Configuration Validator")
    print("=" * 50)
    
    all_issues = []
    
    # Check .env file
    if not check_env_file():
        print("\n❌ Cannot proceed without .env file")
        sys.exit(1)
    
    # Validate configurations
    all_issues.extend(validate_openai_config())
    all_issues.extend(validate_server_config())
    all_issues.extend(test_openai_connection())
    
    # Summary
    print("\n" + "=" * 50)
    if all_issues:
        print("❌ Configuration Issues Found:")
        for issue in all_issues:
            print(f"   {issue}")
        print("\n💡 Please fix these issues before running the server.")
        sys.exit(1)
    else:
        print("✅ All configurations are valid!")
        print("🚀 Your backend is ready to run.")

if __name__ == "__main__":
    main()
