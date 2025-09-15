#!/usr/bin/env node

// Simple script to test backend connectivity
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function testBackendConnectivity() {
  console.log(`Testing backend connectivity to: ${API_URL}`);
  
  try {
    // Test if the backend is running by trying to connect
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: 'admin',
        password: 'AdminPassword123!'
      })
    });
    
    console.log(`Backend responded with status: ${response.status}`);
    
    // Try to get response text for debugging
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.status === 401) {
      console.log('✅ Backend is running (received expected 401 for invalid credentials)');
    } else if (response.status === 400) {
      console.log('✅ Backend is running (received 400 - likely validation error)');
    } else if (response.status === 200) {
      console.log('✅ Backend is running (login succeeded)');
    } else {
      console.log(`⚠️  Backend responded with unexpected status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Backend connection failed:');
    console.log(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on the correct port');
    }
    
    return false;
  }
}

testBackendConnectivity();