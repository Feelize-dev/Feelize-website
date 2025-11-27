const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const subscribersFile = path.join(dataDir, 'newsletter-subscribers.json');
const projectsFile = path.join(dataDir, 'team-projects.json');

// Email configuration (using Gmail as fallback, should be configured with proper SMTP)
// TODO: Team should configure this with actual email service credentials
const createEmailTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

// Send email notification to contact@feelize.com
const sendEmailNotification = async (subject, htmlContent, textContent) => {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.warn('⚠️ Email transporter not configured. Email notification skipped.');
      console.log('📧 Would have sent:', { subject, to: 'contact@feelize.com' });
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'contact@feelize.com',
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return false;
  }
};

// Initialize files if they don't exist
if (!fs.existsSync(subscribersFile)) {
  fs.writeFileSync(subscribersFile, JSON.stringify({ subscribers: [] }, null, 2));
}
if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify({ projects: [] }, null, 2));
}

// Helper to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper to write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// POST /api/newsletter/subscribe - Newsletter signup
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email is required' 
      });
    }

    const data = readJsonFile(subscribersFile);
    if (!data) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to read subscribers data' 
      });
    }

    // Check if already subscribed
    const existingSubscriber = data.subscribers.find(s => s.email === email);
    if (existingSubscriber) {
      return res.json({ 
        success: true, 
        message: 'Already subscribed',
        alreadySubscribed: true 
      });
    }

    // Add new subscriber
    const subscribedAt = new Date().toISOString();
    data.subscribers.push({
      email,
      subscribedAt,
      source: 'team-builder',
      active: true
    });

    if (!writeJsonFile(subscribersFile, data)) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save subscription' 
      });
    }

    console.log(`✅ New newsletter subscriber: ${email}`);

    // Send email notification to contact@feelize.com
    const emailSubject = '🎉 New Newsletter Signup - Team Builder';
    const emailHtml = `
      <h2>New Newsletter Subscriber</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Source:</strong> Team Builder</p>
      <p><strong>Subscribed At:</strong> ${new Date(subscribedAt).toLocaleString()}</p>
      <hr>
      <p><em>This subscriber signed up to access AI features and project reports.</em></p>
    `;
    const emailText = `
New Newsletter Subscriber

Email: ${email}
Source: Team Builder
Subscribed At: ${new Date(subscribedAt).toLocaleString()}

This subscriber signed up to access AI features and project reports.
    `;

    // Send notification (non-blocking)
    sendEmailNotification(emailSubject, emailHtml, emailText)
      .catch(err => console.error('Email notification failed:', err));

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      email 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during subscription' 
    });
  }
});

// POST /api/newsletter/create-project - Create project with team
router.post('/create-project', async (req, res) => {
  try {
    const { email, projectType, team, teamStats } = req.body;

    if (!email || !team || team.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and team are required' 
      });
    }

    // Verify email is subscribed
    const subscribersData = readJsonFile(subscribersFile);
    const isSubscribed = subscribersData && 
      subscribersData.subscribers.some(s => s.email === email && s.active);

    if (!isSubscribed) {
      return res.status(403).json({ 
        success: false, 
        message: 'Email not subscribed to newsletter' 
      });
    }

    const projectsData = readJsonFile(projectsFile);
    if (!projectsData) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to read projects data' 
      });
    }

    // Create project
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project = {
      id: projectId,
      email,
      projectType: projectType || 'custom',
      team: team.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        stats: member.stats
      })),
      teamStats: teamStats || {
        engineering: 0,
        product: 0,
        delivery: 0,
        strategy: 0,
        avgPower: 0
      },
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    projectsData.projects.push(project);

    if (!writeJsonFile(projectsFile, projectsData)) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save project' 
      });
    }

    console.log(`✅ New project created: ${projectId} for ${email}`);
    console.log(`   Team: ${team.map(m => m.name).join(', ')}`);
    console.log(`   Type: ${projectType || 'custom'}`);

    // Send project creation notification to contact@feelize.com
    const projectEmailSubject = '🚀 New Project Created - Team Builder';
    const projectEmailHtml = `
      <h2>New Project Created</h2>
      <p><strong>Project ID:</strong> ${projectId}</p>
      <p><strong>Client Email:</strong> ${email}</p>
      <p><strong>Project Type:</strong> ${projectType || 'Custom'}</p>
      <p><strong>Team Size:</strong> ${team.length} members</p>
      <hr>
      <h3>Team Composition</h3>
      <ul>
        ${team.map(m => `<li><strong>${m.name}</strong> - ${m.role}</li>`).join('')}
      </ul>
      <hr>
      <h3>Team Stats</h3>
      <ul>
        <li>Engineering: ${project.teamStats.engineering}/10</li>
        <li>Product: ${project.teamStats.product}/10</li>
        <li>Delivery: ${project.teamStats.delivery}/10</li>
        <li>Strategy: ${project.teamStats.strategy}/10</li>
        <li><strong>Average Power: ${project.teamStats.avgPower}/10</strong></li>
      </ul>
      <hr>
      <p><strong>Created At:</strong> ${new Date(project.createdAt).toLocaleString()}</p>
      <p><em>Client is ready to start their project. Please follow up!</em></p>
    `;
    const projectEmailText = `
New Project Created

Project ID: ${projectId}
Client Email: ${email}
Project Type: ${projectType || 'Custom'}
Team Size: ${team.length} members

Team Composition:
${team.map(m => `- ${m.name} (${m.role})`).join('\n')}

Team Stats:
- Engineering: ${project.teamStats.engineering}/10
- Product: ${project.teamStats.product}/10
- Delivery: ${project.teamStats.delivery}/10
- Strategy: ${project.teamStats.strategy}/10
- Average Power: ${project.teamStats.avgPower}/10

Created At: ${new Date(project.createdAt).toLocaleString()}

Client is ready to start their project. Please follow up!
    `;

    // Send notification (non-blocking)
    sendEmailNotification(projectEmailSubject, projectEmailHtml, projectEmailText)
      .catch(err => console.error('Project notification email failed:', err));

    res.json({ 
      success: true, 
      message: 'Project created successfully',
      project: {
        id: projectId,
        projectType: project.projectType,
        teamSize: team.length,
        teamStats: project.teamStats
      }
    });

  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during project creation' 
    });
  }
});

// GET /api/newsletter/projects/:email - Get user's projects
router.get('/projects/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email is required' 
      });
    }

    const projectsData = readJsonFile(projectsFile);
    if (!projectsData) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to read projects data' 
      });
    }

    const userProjects = projectsData.projects.filter(p => p.email === email);

    res.json({ 
      success: true, 
      projects: userProjects 
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching projects' 
    });
  }
});

module.exports = router;
