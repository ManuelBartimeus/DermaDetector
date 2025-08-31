// Test script to debug the image upload issue
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://10.233.149.235:3000';

// Function to test different ways of sending the image
const testImageUpload = async () => {
  console.log('🧪 Testing image upload methods...');
  
  try {
    // First test - check what the backend expects
    console.log('\n1️⃣ Testing API documentation endpoint...');
    try {
      const docsResponse = await axios.get(`${BASE_URL}/docs`);
      console.log('✅ API docs accessible');
    } catch (error) {
      console.log('⚠️ API docs not accessible, continuing...');
    }
    
    // Test health endpoint
    console.log('\n2️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test analyze endpoint with empty request to see what it expects
    console.log('\n3️⃣ Testing analyze endpoint with empty request...');
    try {
      const emptyResponse = await axios.post(`${BASE_URL}/analyze`);
    } catch (error) {
      console.log('📋 Empty request error (expected):', error.response?.status, error.response?.data);
      if (error.response?.data?.detail) {
        console.log('🔍 Required fields:', error.response.data.detail);
      }
    }
    
    // Test with a sample image file if available
    console.log('\n4️⃣ Testing with FormData (Node.js style)...');
    
    // Create a simple test file
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'fake image data for testing');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
    });
    
    try {
      const uploadResponse = await axios.post(`${BASE_URL}/analyze`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      console.log('✅ Upload successful:', uploadResponse.data);
    } catch (error) {
      console.log('📋 Upload error:', error.response?.status, error.response?.data);
    }
    
    // Clean up
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Test different field names
const testFieldNames = async () => {
  console.log('\n\n🔬 Testing different field names...');
  
  const fieldNames = ['image', 'file', 'upload'];
  
  for (const fieldName of fieldNames) {
    console.log(`\n📝 Testing field name: "${fieldName}"`);
    
    const formData = new FormData();
    formData.append(fieldName, 'fake image data', {
      filename: 'test.jpg',
      contentType: 'image/jpeg'
    });
    
    try {
      const response = await axios.post(`${BASE_URL}/analyze`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 5000
      });
      console.log(`✅ Field "${fieldName}" worked!`, response.data);
    } catch (error) {
      console.log(`❌ Field "${fieldName}" failed:`, error.response?.status, error.response?.data?.detail?.[0]?.msg);
    }
  }
};

// Run the tests
const runTests = async () => {
  console.log('🧪 Starting backend API debugging tests...');
  await testImageUpload();
  await testFieldNames();
  console.log('\n🏁 Tests completed!');
};

runTests();
