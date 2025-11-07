const express = require('express');
const router = express.Router();
const axios = require('axios');

// AI Analysis endpoint (fallback when frontend doesn't have Gemini key)
router.post('/ai/analyze', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project description'
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `As a senior software architect and AI specialist, analyze this project idea and provide:
            1. Project Overview
            2. Key Features (5-7 items)
            3. Tech Stack Recommendations
            4. Timeline Estimate
            5. Estimated Budget Range
            6. Potential Challenges
            7. Success Metrics
            
            Format the response in clean HTML with proper headings, lists, and styling classes for a dark theme.
            Use Tailwind CSS classes like text-white, text-gray-400, mb-4, etc.
            
            Project Description: ${prompt}`
          }]
        }]
      }
    );

    const analysis = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('AI analysis error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze project. Please try again later.'
    });
  }
});

// AI Chat endpoint (fallback for chatbot)
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Build context from history
    const conversationContext = history && history.length > 0 
      ? history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
      : '';

    const systemContext = `You are Feelize AI assistant. Feelize is a development-first agency specializing in "vibe coding as a service" - building clean, scalable, creative digital experiences.

Services:
- Campaign Sites: $2,999 (1-2 weeks) - 5 landing pages, custom design, lead capture
- E-commerce Pro: $7,999 (4-6 weeks) - Full store, up to 100 products, payment gateways
- SaaS Platform: $20,000+ (8-16 weeks) - Custom web apps, user auth, complex databases

Key Stats:
- 95% faster delivery with AI
- 80% cost savings
- 100% client satisfaction

Process: Discovery Call → AI Planning → Rapid Development → QA → Launch & Scale

Answer questions about Feelize services, pricing, process, and general coding questions helpfully and concisely.`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${systemContext}\n\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`
          }]
        }]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({
      success: true,
      message: reply
    });

  } catch (error) {
    console.error('AI chat error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message. Please try again later.'
    });
  }
});

module.exports = router;
