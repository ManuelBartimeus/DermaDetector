// Test script to verify frontend-backend connectivity
const axios = require('axios');

// Simulate the config values
const CONFIG = {
  BACKEND_URL: 'http://10.233.149.235:3000',
  FALLBACK_URLS: [
    'http://10.233.149.235:3000',
    'http://192.168.137.1:3000',
    'http://localhost:3000'
  ],
  TIMEOUT: {
    HEALTH_CHECK: 5000,
    ANALYSIS: 60000
  }
};

console.log('🧪 Testing backend connectivity...');

// Test function similar to the one in our service
const testConnectivity = async () => {
  console.log('🔍 Checking backend connectivity...');
  
  // Try primary URL first
  try {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/health`, { 
      timeout: CONFIG.TIMEOUT.HEALTH_CHECK 
    });
    console.log('✅ Backend is reachable at primary URL:', CONFIG.BACKEND_URL);
    console.log('📊 Response:', response.data);
    return { success: true, url: CONFIG.BACKEND_URL };
  } catch (primaryError) {
    console.warn('⚠️ Primary URL failed:', primaryError.message);
    
    // Try fallback URLs
    for (const fallbackUrl of CONFIG.FALLBACK_URLS) {
      if (fallbackUrl === CONFIG.BACKEND_URL) continue; // Skip already tried URL
      
      try {
        console.log('🔄 Trying fallback URL:', fallbackUrl);
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
    console.error('❌ All backend URLs failed');
    return { success: false, url: null };
  }
};

// Test supported diseases endpoint
const testSupportedDiseases = async (workingUrl) => {
  try {
    console.log('🔬 Testing supported diseases endpoint...');
    const response = await axios.get(`${workingUrl}/supported-diseases`, { 
      timeout: 10000 
    });
    console.log('✅ Supported diseases endpoint works');
    console.log(`📋 Found ${response.data.total_count} supported diseases`);
    console.log('🏥 First 5 diseases:', response.data.supported_diseases.slice(0, 5));
    return true;
  } catch (error) {
    console.error('❌ Supported diseases test failed:', error.message);
    return false;
  }
};

// Run the tests
const runTests = async () => {
  try {
    // Test connectivity
    const connectivityResult = await testConnectivity();
    
    if (!connectivityResult.success) {
      console.error('❌ Connectivity test failed - backend is not reachable');
      process.exit(1);
    }
    
    // Test endpoints
    await testSupportedDiseases(connectivityResult.url);
    
    console.log('\n🎉 All tests passed! Frontend should be able to connect to backend.');
    console.log('💡 You can now run your React Native app and test image analysis.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run the tests
runTests();
