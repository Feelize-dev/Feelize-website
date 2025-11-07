const axios = require('axios');

async function testProjectAnalyzer() {
  try {
    console.log('Testing /api/ai/analyze-project...');
    const response = await axios.post('http://localhost:3000/api/ai/analyze-project', {
      description: 'I want to build a todo app for managing daily tasks',
      files: []
    });
    console.log('✅ Success!');
    console.log('Report length:', response.data.htmlReport?.length || 0);
    console.log('First 300 chars:', response.data.htmlReport?.substring(0, 300));
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data);
    console.log('Full error:', error);
  }
}

async function testChatReport() {
  try {
    console.log('\nTesting /api/ai/generate-report-from-chat...');
    const response = await axios.post('http://localhost:3000/api/ai/generate-report-from-chat', {
      conversationHistory: [
        { role: 'assistant', content: 'Hi! How can I help?' },
        { role: 'user', content: 'I want to build a social media app' },
        { role: 'assistant', content: 'Sounds great! What features?' },
        { role: 'user', content: 'User profiles, posts, likes, comments' }
      ]
    });
    console.log('✅ Success!');
    console.log('Report length:', response.data.htmlReport?.length || 0);
    console.log('First 300 chars:', response.data.htmlReport?.substring(0, 300));
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data);
    console.log('Message:', error.message);
  }
}

async function runTests() {
  await testProjectAnalyzer();
  await testChatReport();
}

runTests();
