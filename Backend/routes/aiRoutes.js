const express = require('express');
const router = express.Router();
const axios = require('axios');

// Enhanced AI Analysis endpoint with file upload support
router.post('/ai/analyze-project', async (req, res) => {
  try {
    const { description, files } = req.body;

    if (!description && (!files || files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project description or upload files'
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Build comprehensive prompt with file information
    let fullPrompt = `As an expert software architect and project manager, analyze this project and create a comprehensive professional report.

PROJECT DESCRIPTION:
${description || 'No description provided'}

`;

    if (files && files.length > 0) {
      fullPrompt += `\nATTACHED FILES (${files.length}):\n`;
      files.forEach((file, index) => {
        fullPrompt += `\nFile ${index + 1}: ${file.name} (${file.type})\n`;
        if (file.type.startsWith('text/') || file.type.includes('json')) {
          fullPrompt += `Content:\n${file.content}\n`;
        } else if (file.type.startsWith('image/')) {
          fullPrompt += `[Image file - analyze based on filename and context]\n`;
        }
      });
    }

    fullPrompt += `

Generate a COMPLETE, PROFESSIONAL HTML PROJECT REPORT that includes:

1. **Executive Summary** - Brief overview of the project vision
2. **Project Overview** - Detailed description and objectives
3. **Key Features** - List 7-10 specific features with descriptions
4. **Technical Architecture** - Recommended tech stack with justifications
5. **Development Timeline** - Detailed phase-by-phase breakdown with durations
6. **Budget Estimation - Traditional Approach** - CLEARLY LABEL THIS AS "Traditional Software Development Costs". Itemized cost breakdown showing what a traditional agency would charge, including:
   - Development team costs (senior devs at $150-200/hr)
   - Design team costs
   - Project management overhead
   - Quality assurance costs
   - Total traditional estimate
7. **💜 The Feelize Advantage** - IMMEDIATELY after the traditional costs, create a compelling comparison section showing:
   - How Feelize's AI-supercharged engineers deliver the same quality
   - Speed advantage (95% faster delivery)
   - Cost savings (typically 60-80% less than traditional)
   - Our actual recommended pricing for this project
   - Highlight: "Speed of AI + Quality of Professional Engineers"
   - Use gradient backgrounds and make this section visually stand out
8. **Risk Analysis** - Potential challenges and mitigation strategies
9. **Success Metrics** - KPIs and measurement criteria
10. **Next Steps** - Recommended actions to proceed

IMPORTANT: Make the Feelize Advantage section highly visual with:
- Comparison table showing Traditional vs Feelize
- Green checkmarks for our advantages
- Purple gradient backgrounds (#0580E8 to #7000FF)
- Bold savings numbers
- Professional but compelling design

FORMAT THE ENTIRE RESPONSE AS A COMPLETE HTML DOCUMENT with:
- Professional styling using inline CSS
- Print-friendly layout for PDF export
- Feelize branding colors (purple gradients: #0580E8 to #7000FF)
- Modern, clean typography
- Proper sections with headings
- Tables for timeline and budget comparisons
- The HTML should be ready to open in a new window and print as PDF

Start with <!DOCTYPE html> and include full HTML structure.`;

    // Call Gemini API - use gemini-2.5-pro for complex project analysis
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }
    );

    let htmlReport = response.data.candidates[0].content.parts[0].text;
    
    // Clean up markdown code blocks if present
    htmlReport = htmlReport.replace(/```html\n?/g, '').replace(/```\n?/g, '');

    // Ensure it has proper HTML structure
    if (!htmlReport.includes('<!DOCTYPE html>')) {
      htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feelize Project Analysis Report</title>
    <style>
        @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    ${htmlReport}
</body>
</html>`;
    }

    res.status(200).json({
      success: true,
      htmlReport,
      summary: {
        filesAnalyzed: files ? files.length : 0,
        hasDescription: !!description
      }
    });

  } catch (error) {
    console.error('AI PROJECT ANALYSIS error:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze project. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.response?.data || error.message : undefined
    });
  }
});

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

    // Call Gemini API - use gemini-2.5-flash for faster analysis
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

// AI Chat endpoint (fallback for chatbot) - now supports file uploads
router.post('/chat', async (req, res) => {
  try {
    const { message, history, files } = req.body;

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

    const systemContext = `You are Feely (short for Feelize AI Personal Assistant - what your mom used to call you). You're a friendly, conversational AI assistant for Feelize, representing the new approach to software development.

ABOUT FEELIZE:
Feelize = AI-supercharged engineers. We combine the speed and innovation of cutting-edge AI with the quality, structure, and expertise of professional developers and designers. We're backed by the most powerful AI tools in the market, delivering exceptional results that traditional agencies can't match.

PERSONALITY & TONE:
- Be conversational and warm, like chatting with a knowledgeable friend
- Keep responses SHORT and to the point (2-4 sentences max unless explaining something complex)
- If asked your name, say: "I'm Feely! It's what my mom used to call me - short for Feelize AI Personal Assistant 😊"
- Be helpful and understand context from the conversation
- Ask clarifying questions when needed
- If gathering project info, guide users naturally toward details needed for a project report

FEELIZE SERVICES:
- Campaign Sites: $2,999 (1-2 weeks) - Landing pages, lead capture, custom design
- E-commerce Pro: $7,999 (4-6 weeks) - Full online store, payments, inventory
- SaaS Platforms: $20,000+ (8-16 weeks) - Custom web apps, user auth, complex features

KEY STATS:
- 95% faster delivery with AI
- 80% cost savings
- 100% client satisfaction

PROCESS: Discovery → AI Planning → Development → QA → Launch

WHEN DISCUSSING PROJECTS:
If the user is describing a project idea, naturally gather:
1. What they want to build
2. Who it's for (target audience)
3. Key features they envision
4. Timeline expectations
5. Budget range

Once you have enough info, offer: "Want me to generate a detailed project report for you? Just say yes!"

Keep it natural and conversational - don't interrogate, just chat!`;

    // Build message with file context
    let fullMessage = message;
    
    if (files && files.length > 0) {
      fullMessage += `\n\nUser has attached ${files.length} file(s):\n`;
      files.forEach((file, index) => {
        fullMessage += `\nFile ${index + 1}: ${file.name} (${file.type})\n`;
        if (file.type.startsWith('text/') || file.type.includes('json')) {
          fullMessage += `Content:\n${file.content}\n`;
        } else if (file.type.startsWith('image/')) {
          fullMessage += `[Image file - provide relevant advice based on context]\n`;
        }
      });
    }

    // Call Gemini API - use gemini-2.5-flash for fast chat responses
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${systemContext}\n\n${conversationContext}\n\nUser: ${fullMessage}\n\nAssistant:`
          }]
        }]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({
      success: true,
      response: reply
    });

  } catch (error) {
    console.error('AI chat error:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.response?.data || error.message : undefined
    });
  }
});

// Generate project report from chat conversation
router.post('/ai/generate-report-from-chat', async (req, res) => {
  try {
    const { conversationHistory, files } = req.body;

    if (!conversationHistory || conversationHistory.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversation history'
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Build conversation context
    const conversationText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Feely'}: ${msg.content}`)
      .join('\n\n');

    let fullPrompt = `Based on this conversation with a potential client, generate a COMPLETE, PROFESSIONAL HTML PROJECT REPORT.

CONVERSATION:
${conversationText}`;

    // Add file information if files were shared during the conversation
    if (files && files.length > 0) {
      fullPrompt += `\n\nFILES SHARED DURING CONVERSATION (${files.length}):\n`;
      files.forEach((file, index) => {
        fullPrompt += `\nFile ${index + 1}: ${file.name} (${file.type})\n`;
        if (file.type.startsWith('text/') || file.type.includes('json')) {
          fullPrompt += `Content:\n${file.data}\n`;
        } else if (file.type.startsWith('image/')) {
          fullPrompt += `[Image file - analyze based on filename and context from conversation]\n`;
        }
      });
    }

    fullPrompt += `

Extract all relevant project information from the conversation and create a comprehensive report including:

1. **Executive Summary** - Project vision based on what the user described
2. **Project Overview** - Detailed description and objectives
3. **Key Features** - 7-10 specific features mentioned or implied
4. **Technical Architecture** - Recommended tech stack
5. **Development Timeline** - Phase-by-phase breakdown with durations
6. **Budget Estimation - Traditional Approach** - CLEARLY LABEL THIS AS "Traditional Software Development Costs". Show what traditional agencies would charge:
   - Development team costs (senior devs at $150-200/hr)
   - Design, PM, and QA costs
   - Total traditional estimate
7. **💜 The Feelize Advantage** - IMMEDIATELY after traditional costs, create a compelling comparison:
   - Side-by-side comparison table: Traditional vs Feelize
   - Highlight 95% faster delivery, 60-80% cost savings
   - Our actual recommended pricing
   - "Speed of AI + Quality of Professional Engineers"
   - Use purple gradient backgrounds, green checkmarks
   - Make this section visually striking
8. **Risk Analysis** - Potential challenges
9. **Success Metrics** - KPIs for the project
10. **Next Steps** - Recommended actions

IMPORTANT: The Feelize Advantage section must be prominent and compelling with visual comparisons.

FORMAT AS COMPLETE HTML DOCUMENT with:
- Professional styling using inline CSS
- Print-friendly layout for PDF export
- Feelize branding (purple gradients: #0580E8 to #7000FF)
- Modern, clean typography
- Comparison tables with clear visual hierarchy
- Start with <!DOCTYPE html>

If the conversation doesn't have enough details, make reasonable assumptions based on best practices and include a note that these should be refined during discovery.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }
    );

    let htmlReport = response.data.candidates[0].content.parts[0].text;
    
    // Clean up markdown code blocks
    htmlReport = htmlReport.replace(/```html\n?/g, '').replace(/```\n?/g, '');

    // Ensure proper HTML structure
    if (!htmlReport.includes('<!DOCTYPE html>')) {
      htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feelize Project Analysis Report</title>
    <style>
        @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    ${htmlReport}
</body>
</html>`;
    }

    res.status(200).json({
      success: true,
      htmlReport
    });

  } catch (error) {
    console.error('Report generation error:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report. Please try again later.'
    });
  }
});

module.exports = router;
