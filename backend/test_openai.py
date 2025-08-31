"""
Test script for OpenAI integration
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from openai_service import openai_service

def test_openai_integration():
    print("Testing OpenAI integration...")
    
    # Test data
    test_condition = "acne"
    test_confidence = 0.85
    test_advice = "Use gentle cleanser, avoid picking at lesions"
    
    try:
        # Generate detailed analysis
        result = openai_service.generate_detailed_analysis(test_condition, test_confidence, test_advice)
        
        print("✅ OpenAI Service Test Results:")
        print(f"Overview: {result.get('overview', 'N/A')[:100]}...")
        print(f"Detection Details: {result.get('detection_details', 'N/A')[:100]}...")
        print(f"Recommendations: {result.get('recommendations', 'N/A')[:100]}...")
        print(f"Important Notes: {result.get('important_notes', 'N/A')[:100]}...")
        print(f"Next Steps: {result.get('next_steps', 'N/A')[:100]}...")
        
        return True
    except Exception as e:
        print(f"❌ Error testing OpenAI integration: {e}")
        return False

if __name__ == "__main__":
    test_openai_integration()
