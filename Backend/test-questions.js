const axios = require('axios');

async function testGenerateQuestions() {
  try {
    console.log('Testing /api/ai/generate-questions endpoint...');
    
    const response = await axios.post('http://localhost:3000/api/ai/generate-questions', {
      description: 'I want to build a simple landing page for my startup',
      files: []
    });

    console.log('Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testGenerateQuestions();
