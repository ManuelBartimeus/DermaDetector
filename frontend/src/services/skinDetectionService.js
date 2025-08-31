import axios from 'axios';
import { CONFIG } from '../config/appConfig';

// Use the configured backend URL
const BACKEND_API_URL = CONFIG.BACKEND_URL;

console.log('🌐 Backend URL configured as:', BACKEND_API_URL);

// Enhanced connectivity check with fallback URLs
export const checkBackendConnectivity = async () => {
  console.log('🔍 Checking backend connectivity...');
  
  // Try primary URL first
  try {
    const response = await axios.get(`${BACKEND_API_URL}/health`, { 
      timeout: CONFIG.TIMEOUT.HEALTH_CHECK 
    });
    console.log('✅ Backend is reachable at primary URL:', BACKEND_API_URL);
    console.log('📊 Response:', response.data);
    return { success: true, url: BACKEND_API_URL };
  } catch (primaryError) {
    console.warn('⚠️ Primary URL failed:', primaryError.message);
    
    // Try fallback URLs
    for (const fallbackUrl of CONFIG.FALLBACK_URLS) {
      if (fallbackUrl === BACKEND_API_URL) continue; // Skip already tried URL
      
      try {
        console.log('� Trying fallback URL:', fallbackUrl);
        const response = await axios.get(`${fallbackUrl}/health`, { 
          timeout: CONFIG.TIMEOUT.HEALTH_CHECK 
        });
        console.log('✅ Backend is reachable at fallback URL:', fallbackUrl);
        console.log('📊 Response:', response.data);
        return { success: true, url: fallbackUrl };
      } catch (fallbackError) {
        console.warn('⚠️ Fallback URL failed:', fallbackUrl, fallbackError.message);
      }
    }
    
    // All URLs failed
    console.error('❌ All backend URLs failed. Please check:');
    console.error('  1. Backend server is running: python main.py');
    console.error('  2. Computer IP address is correct in config');
    console.error('  3. Device and computer are on same WiFi network');
    console.error('  4. Windows Firewall allows the connection');
    
    return { success: false, url: null };
  }
};

// Convert image URI to FormData for React Native
const createFormData = async (imageUri) => {
  try {
    console.log('📄 Starting FormData creation for URI:', imageUri);
    
    const formData = new FormData();
    
    // Extract filename and determine type
    const filename = imageUri.split('/').pop() || 'skin_image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const fileExtension = match ? match[1].toLowerCase() : 'jpg';
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    
    console.log('📄 File details:', { filename, fileExtension, mimeType });
    
    // Create the file object for React Native
    const fileObject = {
      uri: imageUri,
      name: filename,
      type: mimeType,
    };
    
    console.log('📦 File object created:', fileObject);
    
    // Append to FormData with the correct field name that matches FastAPI parameter
    formData.append('image', fileObject);
    
    console.log('✅ FormData created successfully with field "image"');
    
    // Log FormData contents for debugging (React Native specific)
    if (formData._parts) {
      console.log('🔍 FormData parts:', formData._parts.length);
      formData._parts.forEach((part, index) => {
        console.log(`  Part ${index}:`, part[0], typeof part[1] === 'object' ? 'File Object' : part[1]);
      });
    }
    
    return formData;
  } catch (error) {
    console.error('❌ FormData creation failed:', error);
    throw new Error(`Failed to create form data: ${error.message}`);
  }
};

// Main function to detect skin disease using our new backend
export const detectSkinDisease = async (imageUri) => {
  try {
    console.log('🔍 Starting skin disease detection...');
    console.log('📷 Image URI:', imageUri);
    console.log('🌐 Backend URL:', BACKEND_API_URL);
    
    // First check if backend is reachable and get working URL
    const connectivityResult = await checkBackendConnectivity();
    if (!connectivityResult.success) {
      throw new Error('Backend server is not reachable. Please ensure the backend is running and your device is connected to the same network.');
    }
    
    const workingUrl = connectivityResult.url;
    console.log('🎯 Using backend URL:', workingUrl);
    
    // Create form data with the image
    const formData = await createFormData(imageUri);
    console.log('📦 Form data created successfully');
    
    // Log the request details for debugging
    console.log('🚀 Making API request with details:');
    console.log('  URL:', `${workingUrl}/analyze`);
    console.log('  Method: POST');
    console.log('  Content-Type: multipart/form-data');
    console.log('  Timeout:', CONFIG.TIMEOUT.ANALYSIS, 'ms');
    
    // Make API request to our Python backend using the working URL
    const response = await axios({
      method: 'POST',
      url: `${workingUrl}/analyze`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: CONFIG.TIMEOUT.ANALYSIS, // Use timeout from config
    });

    console.log('✅ Backend response received:', response.status);
    console.log('📊 Response headers:', response.headers);
    console.log('📋 Response data keys:', Object.keys(response.data || {}));

    // Process the response
    if (response.data && response.data.success) {
      console.log('🎉 Detection successful:', response.data.result.disease);
      return processBackendResponse(response.data);
    } else {
      throw new Error('No data received from backend API');
    }
  } catch (error) {
    console.error('❌ Backend API Error:', error);
    
    if (error.response) {
      // API returned an error response
      console.error('📋 Full error response:', error.response);
      console.error('📊 Error status:', error.response.status);
      console.error('📋 Error data:', error.response.data);
      
      let errorMessage = 'Unknown error';
      
      if (error.response.status === 422) {
        // Validation error - extract field information
        const detail = error.response.data?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          const fieldErrors = detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          errorMessage = `Validation Error: ${fieldErrors}`;
        } else {
          errorMessage = `Validation Error: ${JSON.stringify(detail)}`;
        }
      } else {
        errorMessage = error.response.data?.detail || error.response.data?.message || `HTTP ${error.response.status} Error`;
      }
      
      throw new Error(`API Error (${error.response.status}): ${errorMessage}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('🌐 Network error details:', error.request);
      throw new Error('Network error: No response from server. Make sure the backend is running and reachable.');
    } else {
      // Something else went wrong
      console.error('🔧 Request setup error:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Process the backend API response and format it for our app
const processBackendResponse = (apiResponse) => {
  try {
    const result = apiResponse.result;
    
    if (!result) {
      throw new Error('Invalid response format from backend');
    }

    // Format confidence as percentage
    const confidencePercentage = Math.round((result.probability || 0) * 100);
    
    // Determine urgency based on the detected condition
    const getUrgency = (disease) => {
      const highUrgencyConditions = [
        'skin cancer', 'melanoma', 'basal cell carcinoma', 'squamous cell carcinoma'
      ];
      const moderateUrgencyConditions = [
        'actinic keratosis', 'drug eruption', 'lupus', 'vasculitis'
      ];
      
      const diseaseLower = disease.toLowerCase();
      
      if (highUrgencyConditions.some(condition => diseaseLower.includes(condition))) {
        return 'high';
      } else if (moderateUrgencyConditions.some(condition => diseaseLower.includes(condition))) {
        return 'moderate';
      } else {
        return 'low';
      }
    };

    // Format the visit preparation advice
    const getVisitPreparation = (disease, symptoms) => {
      return [
        "Take clear photos of the affected area from different angles",
        "Note when symptoms first appeared and any changes over time",
        "List any medications you're currently taking",
        "Prepare questions about treatment options and timeline",
        "Consider bringing a family member for support"
      ];
    };

    // Format previsit care advice
    const getPrevisitCare = (disease, treatments) => {
      const basicCare = [
        "Keep the affected area clean and dry",
        "Avoid scratching or picking at the area",
        "Protect from sun exposure if needed",
        "Take photos to monitor any changes"
      ];
      
      return basicCare;
    };

    return {
      success: true,
      result: {
        // Main detection result
        condition: result.disease,
        confidence: `${confidencePercentage}%`,
        
        // Raw backend data for detailed analysis
        disease: result.disease,
        probability: result.probability,
        detailed_analysis: result.detailed_analysis,
        
        // Medical information
        overview: result.overview,
        symptoms: result.symptoms || [],
        causes: result.causes || [],
        treatments: result.treatments || [],
        
        // Visit information
        urgency: getUrgency(result.disease),
        previsitCare: getPrevisitCare(result.disease, result.treatments),
        visitPreparation: getVisitPreparation(result.disease, result.symptoms),
        
        // Similar conditions (simplified for now)
        similarConditions: getSimilarConditions(result.disease),
        
        // Technical details
        processingTime: result.time,
        modelUsed: "Vision Transformer (ViT) ONNX Model",
        
        // Raw response for debugging
        raw_response: apiResponse
      }
    };

  } catch (error) {
    console.error('Error processing backend response:', error);
    throw new Error('Failed to process detection results');
  }
};

// Helper function to get similar conditions
const getSimilarConditions = (detectedDisease) => {
  const conditionGroups = {
    'acne': ['rosacea', 'seborrheic keratoses'],
    'eczema': ['psoriasis', 'dermatitis'],
    'psoriasis': ['eczema', 'seborrheic keratoses'],
    'skin cancer': ['actinic keratosis', 'moles', 'seborrheic keratoses'],
    'moles': ['skin cancer', 'seborrheic keratoses'],
    'rosacea': ['acne', 'lupus'],
    'tinea': ['candidiasis', 'eczema'],
    'vitiligo': ['lupus', 'other autoimmune conditions'],
    'warts': ['moles', 'seborrheic keratoses']
  };
  
  const diseaseLower = detectedDisease.toLowerCase();
  
  for (const [key, similar] of Object.entries(conditionGroups)) {
    if (diseaseLower.includes(key)) {
      return similar;
    }
  }
  
  return ['Consult dermatologist for differential diagnosis'];
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BACKEND_API_URL}/health`,
      timeout: 5000,
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Backend health check failed');
  }
};

// Get supported diseases
export const getSupportedDiseases = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BACKEND_API_URL}/supported-diseases`,
      timeout: 10000,
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch supported diseases');
  }
};

// Helper function for URL-based image detection (if needed)
export const detectSkinDiseaseFromUrl = async (imageUrl) => {
  try {
    // For URL-based detection, we'd need to modify the backend
    // For now, this is a placeholder
    throw new Error('URL-based detection not implemented yet');
  } catch (error) {
    console.error('URL-based detection error:', error);
    throw error;
  }
};
