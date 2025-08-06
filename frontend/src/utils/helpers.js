// Utility functions for the AI Skin Detector app

export const formatConfidence = (confidence) => {
  if (typeof confidence === 'number') {
    return `${Math.round(confidence * 100)}%`;
  }
  if (typeof confidence === 'string' && confidence.includes('%')) {
    return confidence;
  }
  return `${confidence}%`;
};

export const validateImageUri = (uri) => {
  if (!uri) return false;
  return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('http');
};

export const getErrorMessage = (error) => {
  if (error.response) {
    // API returned an error response
    switch (error.response.status) {
      case 400:
        return 'Invalid image format. Please try a different image.';
      case 401:
        return 'API authentication failed. Please try again later.';
      case 403:
        return 'Access denied. Please check your internet connection.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `API Error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your internet connection and try again.';
  } else if (error.message) {
    // Something else went wrong
    return error.message;
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

export const getSeverityLevel = (condition) => {
  const urgentConditions = ['melanoma', 'basal cell carcinoma', 'squamous cell carcinoma'];
  const moderateConditions = ['psoriasis', 'severe acne', 'infected eczema'];
  
  const conditionLower = condition.toLowerCase();
  
  if (urgentConditions.some(urgent => conditionLower.includes(urgent))) {
    return 'urgent';
  } else if (moderateConditions.some(moderate => conditionLower.includes(moderate))) {
    return 'moderate';
  } else {
    return 'mild';
  }
};

export const getSeverityColor = (condition) => {
  const severity = getSeverityLevel(condition);
  
  switch (severity) {
    case 'urgent':
      return '#d32f2f'; // Red
    case 'moderate':
      return '#f57c00'; // Orange
    case 'mild':
      return '#388e3c'; // Green
    default:
      return '#005a9c'; // Blue (default)
  }
};
