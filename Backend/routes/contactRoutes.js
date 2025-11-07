const express = require('express');
const router = express.Router();

// Contact form submission endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, email, company, phone, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !projectType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, projectType, and message'
      });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Trigger CRM integration
    
    // For now, just log and return success
    console.log('Contact form submission:', {
      name,
      email,
      company,
      phone,
      projectType,
      budget,
      message,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

module.exports = router;
