import axios from 'axios';

const ROBOFLOW_API_KEY = '5fxTZfn90fvoTOD4zkUo';
const ROBOFLOW_API_URL = 'https://serverless.roboflow.com/skin-disease-ieqns/3';

// Convert image URI to base64 for React Native
const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data:image/jpeg;base64, prefix if it exists
        const base64 = reader.result.split(',')[1] || reader.result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error.message}`);
  }
};

// Main function to detect skin disease using Roboflow API
export const detectSkinDisease = async (imageUri) => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);
    
    // Make API request to Roboflow
    const response = await axios({
      method: 'POST',
      url: ROBOFLOW_API_URL,
      params: {
        api_key: ROBOFLOW_API_KEY,
      },
      data: base64Image,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000, // 30 second timeout
    });

    // Process the response
    if (response.data) {
      return processRoboflowResponse(response.data);
    } else {
      throw new Error('No data received from API');
    }
  } catch (error) {
    console.error('Roboflow API Error:', error);
    
    if (error.response) {
      // API returned an error response
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response from server');
    } else {
      // Something else went wrong
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Process the Roboflow API response and format it for our app
const processRoboflowResponse = (apiResponse) => {
  try {
    // Check if predictions exist
    if (!apiResponse.predictions || apiResponse.predictions.length === 0) {
      return {
        success: true,
        result: {
          condition: 'No skin condition detected',
          confidence: '0%',
          advice: 'No specific skin condition was identified in the image. If you have concerns, please consult a healthcare professional.',
          detections: [],
          raw_response: apiResponse
        }
      };
    }

    // Get the prediction with highest confidence
    const topPrediction = apiResponse.predictions.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );

    // Format confidence as percentage
    const confidencePercentage = Math.round(topPrediction.confidence * 100);
    
    // Map class names to more user-friendly names and advice
    const conditionMapping = {
      'acne': {
        name: 'Acne',
        advice: 'Keep skin clean, avoid touching affected areas. Consider over-the-counter treatments or consult a dermatologist for persistent cases.'
      },
      'eczema': {
        name: 'Eczema',
        advice: 'Keep skin moisturized, avoid known triggers, and use gentle skincare products. Consult a dermatologist for proper treatment.'
      },
      'psoriasis': {
        name: 'Psoriasis',
        advice: 'This is a chronic condition. Consult a dermatologist for proper diagnosis and treatment options.'
      },
      'rosacea': {
        name: 'Rosacea',
        advice: 'Avoid triggers like sun exposure, spicy foods, and alcohol. Use gentle skincare and consult a dermatologist.'
      },
      'melanoma': {
        name: 'Melanoma (Suspicious)',
        advice: 'URGENT: This may be a serious condition. Please consult a dermatologist or healthcare provider immediately.'
      },
      'basal_cell_carcinoma': {
        name: 'Basal Cell Carcinoma (Suspicious)',
        advice: 'Please consult a dermatologist promptly for proper evaluation and treatment.'
      }
    };

    const detectedClass = topPrediction.class.toLowerCase();
    const conditionInfo = conditionMapping[detectedClass] || {
      name: topPrediction.class,
      advice: 'Please consult a healthcare professional for proper diagnosis and treatment advice.'
    };

    return {
      success: true,
      result: {
        condition: conditionInfo.name,
        confidence: `${confidencePercentage}%`,
        advice: conditionInfo.advice,
        detections: apiResponse.predictions,
        raw_response: apiResponse,
        // Additional metadata
        image_dimensions: {
          width: apiResponse.image?.width,
          height: apiResponse.image?.height
        },
        processing_time: apiResponse.time
      }
    };

  } catch (error) {
    console.error('Error processing Roboflow response:', error);
    throw new Error('Failed to process detection results');
  }
};

// Helper function for URL-based image detection (if needed)
export const detectSkinDiseaseFromUrl = async (imageUrl) => {
  try {
    const response = await axios({
      method: 'POST',
      url: ROBOFLOW_API_URL,
      params: {
        api_key: ROBOFLOW_API_KEY,
        image: imageUrl,
      },
      timeout: 30000,
    });

    if (response.data) {
      return processRoboflowResponse(response.data);
    } else {
      throw new Error('No data received from API');
    }
  } catch (error) {
    console.error('Roboflow URL API Error:', error);
    throw error;
  }
};
