#!/usr/bin/env node

// Simple script to test the upload endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Next.js usually runs on 3001 in dev

async function testUploadEndpoint() {
  console.log(`Testing upload endpoint: http://localhost:3001/api/upload`);
  
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = Buffer.from([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 
      0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 
      8, 215, 99, 248, 15, 0, 0, 1, 0, 1, 0, 24, 221, 139, 176, 0, 0, 0, 0, 73, 
      69, 78, 68, 174, 66, 96, 130
    ]);
    
    // Use FormData for Node.js
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', testImageData, {
      filename: 'test.png',
      contentType: 'image/png'
    });
    
    const response = await fetch(`http://localhost:3001/api/upload`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    console.log(`Upload endpoint responded with status: ${response.status}`);
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok) {
      console.log('✅ Upload endpoint is working');
    } else {
      console.log('❌ Upload endpoint failed');
    }
    
  } catch (error) {
    console.log('❌ Upload endpoint test failed:');
    console.log(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the Next.js dev server is running: npm run dev');
    }
  }
}

testUploadEndpoint();