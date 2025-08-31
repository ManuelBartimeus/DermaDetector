// Configuration file for the AI Derma Detector app
import { Platform } from 'react-native';

// Your computer's IP address - UPDATE THIS WITH YOUR ACTUAL IP
// To find your IP address:
// Windows: Open Command Prompt and run: ipconfig
// Look for "IPv4 Address" under your active network adapter
const COMPUTER_IP = '10.233.149.235'; // Your primary IP address
const FALLBACK_IP = '192.168.137.1';  // Your secondary IP address (if needed)

// Backend configuration
export const CONFIG = {
  // Backend API URL based on platform and environment
  BACKEND_URL: (() => {
    if (__DEV__) {
      // Development mode
      if (Platform.OS === 'web') {
        // Expo web - localhost works
        return 'http://localhost:3000';
      } else {
        // React Native (iOS/Android) - use computer's IP
        return `http://${COMPUTER_IP}:3000`;
      }
    } else {
      // Production mode - update with your production server
      return 'http://localhost:3000';
    }
  })(),
  
  // Alternative URLs to try if primary fails
  FALLBACK_URLS: [
    `http://${COMPUTER_IP}:3000`,
    `http://${FALLBACK_IP}:3000`,
    'http://localhost:3000',
  ],
  
  // Request timeout settings
  TIMEOUT: {
    HEALTH_CHECK: 5000,    // 5 seconds for health checks
    IMAGE_ANALYSIS: 60000, // 60 seconds for image analysis
  },
  
  // Debug settings
  DEBUG: __DEV__,
};

// Log configuration on startup
if (CONFIG.DEBUG) {
  console.log('🔧 App Configuration:');
  console.log('  Platform:', Platform.OS);
  console.log('  Backend URL:', CONFIG.BACKEND_URL);
  console.log('  Fallback URLs:', CONFIG.FALLBACK_URLS);
}
