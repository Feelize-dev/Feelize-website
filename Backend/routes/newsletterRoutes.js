const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const subscribersFile = path.join(dataDir, 'newsletter-subscribers.json');
const projectsFile = path.join(dataDir, 'team-projects.json');

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
    data.subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
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
