const axios = require('axios');

async function quickTest() {
  try {
    console.log('Testing /api/chat...');
    const response = await axios.post('http://localhost:3000/api/chat', {
      message: 'Hello',
      history: []
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data);
    console.log('Full error:', error.message);
  }
}

quickTest();
