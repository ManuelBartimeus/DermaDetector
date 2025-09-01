import requests
import json
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class OpenAIService:
    def __init__(self):
        # Load API key from environment variable - no fallback for security
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.base_url = os.getenv('OPENAI_BASE_URL', 'https://openrouter.ai/api/v1')
        self.model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
        
        # Validate that API key is configured
        if not self.api_key:
            print("WARNING: OPENAI_API_KEY environment variable is not set!")
            print("Please set the OPENAI_API_KEY in your .env file or environment variables.")
            
        # Don't log the API key, even partially for security
        print(f"OpenAI Service initialized with model: {self.model}")
        print(f"OpenAI Base URL: {self.base_url}")
        
    def _is_configured(self) -> bool:
        """Check if the OpenAI service is properly configured"""
        return bool(self.api_key and self.api_key.strip())
        
    def generate_detailed_analysis(self, condition: str, confidence: float, basic_advice: str) -> Dict[str, str]:
        """
        Generate detailed analysis sections for the results screen
        """
        # Check if OpenAI is properly configured
        if not self._is_configured():
            print("OpenAI API key not configured, returning fallback response")
            return self._get_fallback_response(condition, basic_advice, confidence)
            
        try:
            prompt = f"""
You are a medical AI assistant providing detailed educational information about skin conditions. 
Based on the detected condition "{condition}" with {confidence*100:.1f}% confidence, provide comprehensive information for each section below.

IMPORTANT: Always include medical disclaimers and emphasize the need for professional consultation.

Please provide responses for the following sections:

1. OVERVIEW: A detailed explanation of the condition, what it is, common causes, and typical characteristics. Keep it educational but accessible.

2. DETECTION_DETAILS: Technical details about the detection, what visual features were identified, typical presentation patterns, and any relevant diagnostic information.

3. RECOMMENDATIONS: Comprehensive care recommendations including immediate care, lifestyle modifications, skincare routines, and when to seek medical attention.

4. IMPORTANT_NOTES: Critical safety information, potential complications, red flags to watch for, and important medical disclaimers.

5. NEXT_STEPS: Step-by-step action plan including timeline for medical consultation, monitoring instructions, and follow-up care recommendations.

Basic advice from initial analysis: {basic_advice}

Format your response as a JSON object with keys: overview, detection_details, recommendations, important_notes, next_steps
"""

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are a medical AI assistant providing educational information about skin conditions. Always emphasize that AI analysis is not a substitute for professional medical diagnosis and care."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "max_tokens": 2000,
                "temperature": 0.3
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Try to parse as JSON
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    # If JSON parsing fails, create structured response from text
                    return self._parse_text_response(content, condition, basic_advice, confidence)
            else:
                print(f"OpenAI API error: {response.status_code}")
                # Don't log the full response as it might contain sensitive info
                return self._get_fallback_response(condition, basic_advice, confidence)
                
        except requests.exceptions.Timeout:
            print("OpenAI API request timed out")
            return self._get_fallback_response(condition, basic_advice, confidence)
        except requests.exceptions.ConnectionError:
            print("Failed to connect to OpenAI API")
            return self._get_fallback_response(condition, basic_advice, confidence)
        except Exception as e:
            print(f"Error generating detailed analysis: {type(e).__name__}")
            # Don't log the full error message as it might contain sensitive info
            return self._get_fallback_response(condition, basic_advice, confidence)
    
    def _parse_text_response(self, content: str, condition: str, basic_advice: str, confidence: float) -> Dict[str, str]:
        """
        Parse non-JSON response into structured format
        """
        # This is a fallback parser for non-JSON responses
        sections = {
            "overview": "",
            "detection_details": "",
            "recommendations": "",
            "important_notes": "",
            "next_steps": ""
        }
        
        # Simple parsing - look for section headers
        lines = content.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in ['overview', '1.']):
                current_section = 'overview'
            elif any(keyword in line.lower() for keyword in ['detection', 'details', '2.']):
                current_section = 'detection_details'
            elif any(keyword in line.lower() for keyword in ['recommendation', '3.']):
                current_section = 'recommendations'
            elif any(keyword in line.lower() for keyword in ['important', 'notes', '4.']):
                current_section = 'important_notes'
            elif any(keyword in line.lower() for keyword in ['next', 'steps', '5.']):
                current_section = 'next_steps'
            elif current_section and line:
                sections[current_section] += line + "\n"
        
        # Clean up sections
        for key in sections:
            sections[key] = sections[key].strip()
            if not sections[key]:
                sections[key] = self._get_fallback_response(condition, basic_advice, confidence)[key]
        
        return sections
    
    def _get_fallback_response(self, condition: str, basic_advice: str, confidence: float = 0.0) -> Dict[str, str]:
        """
        Provide fallback response when OpenAI API is unavailable
        """
        return {
            "overview": f"The AI analysis indicates a possible case of {condition}. This is a preliminary assessment based on visual pattern recognition and should not be considered a definitive medical diagnosis. {condition.capitalize()} is a skin condition that may require professional medical evaluation for proper identification and treatment planning.",
            
            "detection_details": f"The AI model analyzed visual features in the uploaded image and identified patterns consistent with {condition} with a confidence level of {confidence*100:.1f}%. The detection algorithm evaluated factors such as texture, color patterns, and morphological characteristics. Please note that AI detection has limitations and cannot replace clinical examination by a healthcare professional.",
            
            "recommendations": f"{basic_advice}\n\nGeneral care recommendations:\n• Keep the affected area clean and dry\n• Avoid harsh soaps or irritating products\n• Do not scratch or pick at the area\n• Monitor for changes in appearance\n• Seek professional medical advice for proper diagnosis and treatment",
            
            "important_notes": f"⚠️ IMPORTANT MEDICAL DISCLAIMER:\n• This AI analysis is for educational purposes only\n• Results should NOT be used for self-diagnosis or treatment\n• Always consult a qualified healthcare provider for medical advice\n• AI detection may have false positives or miss important details\n• Some serious conditions may appear similar to benign ones\n• Early professional consultation is recommended for all skin concerns",
            
            "next_steps": f"Recommended action plan:\n1. Save these results for your medical consultation\n2. Schedule an appointment with a dermatologist or healthcare provider within 1-2 weeks\n3. Monitor the area daily for any changes (size, color, texture, symptoms)\n4. Take additional photos to track progression\n5. Avoid self-treatment until professional evaluation\n6. Seek immediate medical attention if you notice rapid changes, bleeding, or severe symptoms"
        }

# Global instance
openai_service = OpenAIService()
