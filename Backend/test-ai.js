require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing AI functionality...');
console.log('Gemini API Key present:', !!GEMINI_API_KEY);
console.log('Key starts with:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'N/A');

async function testGeminiAPI() {
  try {
    console.log('\n🧪 Testing Gemini 2.5 Flash API directly...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: 'Say "Hello from Feelize!" in a friendly way.'
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Gemini 2.5 Flash API Response:');
    console.log(response.data.candidates[0].content.parts[0].text);
    return true;
  } catch (error) {
    console.error('❌ Gemini API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testBackendEndpoint() {
  try {
    console.log('\n🧪 Testing Backend /api/ai/analyze-project endpoint...');
    
    const response = await axios.post(
      'http://localhost:3000/api/ai/analyze-project',
      {
        description: 'A simple todo app for managing daily tasks',
        files: []
      }
    );

    console.log('✅ Backend Response:');
    console.log('Success:', response.data.success);
    console.log('HTML Report length:', response.data.htmlReport?.length || 0, 'characters');
    console.log('First 200 chars:', response.data.htmlReport?.substring(0, 200) || 'N/A');
    return true;
  } catch (error) {
    console.error('❌ Backend Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testChatEndpoint() {
  try {
    console.log('\n🧪 Testing Backend /api/chat endpoint...');
    
    const response = await axios.post(
      'http://localhost:3000/api/chat',
      {
        message: 'What is Feelize?',
        history: []
      }
    );

    console.log('✅ Chat Response:');
    console.log(response.data.response);
    return true;
  } catch (error) {
    console.error('❌ Chat Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function runAllTests() {
  console.log('=' .repeat(60));
  console.log('FEELIZE AI FUNCTIONALITY TEST');
  console.log('=' .repeat(60));
  
  const test1 = await testGeminiAPI();
  const test2 = await testBackendEndpoint();
  const test3 = await testChatEndpoint();
  
  console.log('\n' + '=' .repeat(60));
  console.log('TEST RESULTS:');
  console.log('Gemini 2.5 Flash API Direct:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Backend Project Analyzer:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('Backend Chat:', test3 ? '✅ PASS' : '❌ FAIL');
  console.log('=' .repeat(60));
  
  process.exit(test1 && test2 && test3 ? 0 : 1);
}

runAllTests();
