const axios = require('axios');

async function testHealth() {
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
      console.error('Code:', error.code);
    }
    return false;
  }
}

async function testChat() {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/chat',
      {
        message: 'Hello',
        history: []
      }
    );
    console.log('✅ Chat endpoint worked:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Chat endpoint failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
      console.error('Code:', error.code);
    }
    return false;
  }
}

async function main() {
  console.log('Testing health endpoint...\n');
  await testHealth();
  
  console.log('\n\nTesting chat endpoint...\n');
  await testChat();
}

main();
