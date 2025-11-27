# 📧 Newsletter Wall & Email Notifications Setup

## 🎯 Overview

This feature implements a newsletter signup wall that gates AI features and project creation. When users sign up or create projects, email notifications are sent to **contact@feelize.com**.

---

## ✅ What's Already Implemented

### **Frontend (feelize-ai)**
- ✅ Newsletter signup modal with email validation
- ✅ Access control (locked features until signup)
- ✅ Visual indicators (green badge for signed-up users)
- ✅ Local storage persistence
- ✅ Graceful degradation (works offline)
- ✅ Project creation with team composition

### **Backend (Backend)**
- ✅ Newsletter subscription API endpoint
- ✅ Project creation API endpoint
- ✅ JSON file storage for subscribers and projects
- ✅ Email notification infrastructure (nodemailer)
- ✅ Duplicate email prevention
- ✅ Data validation and error handling

---

## 🚨 REQUIRED: Team Implementation Tasks

### **1. Email Service Configuration** ⚠️ CRITICAL

The email notifications are configured but **NOT ACTIVE** until you complete this:

#### **Option A: Gmail (Quick Setup)**

1. **Create a Gmail App Password:**
   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Go to Security > 2-Step Verification > App Passwords
   - Generate an app password for "Mail"

2. **Add to `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-app-password-here
   SMTP_FROM=noreply@feelize.com
   ```

#### **Option B: SendGrid (Recommended for Production)**

1. **Sign up at SendGrid:**
   - Go to https://sendgrid.com
   - Create account and verify domain
   - Generate API key

2. **Add to `.env` file:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@feelize.com
   ```

#### **Option C: Custom SMTP Server**

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@feelize.com
```

### **2. Install nodemailer Package** ⚠️ REQUIRED

```bash
cd Backend
npm install nodemailer
```

**Status:** Package needs to be installed for email functionality.

### **3. Test Email Configuration**

Create a test file `Backend/test-email.js`:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'contact@feelize.com',
      subject: 'Test Email - Newsletter System',
      text: 'This is a test email from the newsletter signup system.',
      html: '<h1>Test Email</h1><p>Newsletter system is working!</p>',
    });
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();
```

Run the test:
```bash
node test-email.js
```

### **4. Configure Frontend API URL** (Optional)

For production, create `feelize-ai/.env`:

```env
VITE_API_URL=https://api.feelize.com
```

For development, it defaults to `http://localhost:3000`.

---

## 📧 Email Notifications

### **What Gets Sent to contact@feelize.com:**

#### **1. New Newsletter Signup**
```
Subject: 🎉 New Newsletter Signup - Team Builder

Email: user@example.com
Source: Team Builder
Subscribed At: Nov 8, 2025, 10:30 AM

This subscriber signed up to access AI features and project reports.
```

#### **2. New Project Creation**
```
Subject: 🚀 New Project Created - Team Builder

Project ID: proj_1699456789_abc123
Client Email: user@example.com
Project Type: Web Application
Team Size: 4 members

Team Composition:
- Bloch (Founder & Architect)
- Victor (Lead Developer)
- Paul (UI/UX Designer)
- Aleef (Backend Developer)

Team Stats:
- Engineering: 9/10
- Product: 7/10
- Delivery: 8/10
- Strategy: 7/10
- Average Power: 8/10

Created At: Nov 8, 2025, 10:35 AM

Client is ready to start their project. Please follow up!
```

---

## 🗄️ Data Storage

### **Files Created Automatically:**

```
Backend/
  data/
    newsletter-subscribers.json    # All email signups
    team-projects.json              # All created projects
```

### **Subscriber Data Format:**
```json
{
  "subscribers": [
    {
      "email": "user@example.com",
      "subscribedAt": "2025-11-08T10:30:00.000Z",
      "source": "team-builder",
      "active": true
    }
  ]
}
```

### **Project Data Format:**
```json
{
  "projects": [
    {
      "id": "proj_1699456789_abc123",
      "email": "user@example.com",
      "projectType": "web-app",
      "team": [
        {
          "id": "victor",
          "name": "Victor",
          "role": "Lead Developer",
          "stats": {
            "engineering": 10,
            "product": 6,
            "delivery": 9,
            "strategy": 7
          }
        }
      ],
      "teamStats": {
        "engineering": 9,
        "product": 7,
        "delivery": 8,
        "strategy": 7,
        "avgPower": 8
      },
      "createdAt": "2025-11-08T10:35:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

## 🔧 Maintenance Tasks

### **View Subscribers:**
```bash
cd Backend
cat data/newsletter-subscribers.json
```

### **View Projects:**
```bash
cd Backend
cat data/team-projects.json
```

### **Export to CSV (for analysis):**

Create `Backend/export-subscribers.js`:
```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/newsletter-subscribers.json'));

console.log('Email,Subscribed At,Source,Active');
data.subscribers.forEach(s => {
  console.log(`${s.email},${s.subscribedAt},${s.source},${s.active}`);
});
```

Run:
```bash
node export-subscribers.js > subscribers.csv
```

---

## 🧪 Testing Checklist

### **Email Configuration:**
- [ ] Install nodemailer: `npm install nodemailer`
- [ ] Configure SMTP settings in `.env`
- [ ] Run email test: `node test-email.js`
- [ ] Verify email received at contact@feelize.com

### **Newsletter Signup:**
- [ ] Visit team builder page
- [ ] Build a team (drag members)
- [ ] Click "Lock In Team"
- [ ] Signup modal appears
- [ ] Enter email and submit
- [ ] Check localStorage for saved email
- [ ] Verify green "Signed Up" badge appears
- [ ] Check `data/newsletter-subscribers.json`
- [ ] Verify email sent to contact@feelize.com

### **Project Creation:**
- [ ] Build a team (as signed-up user)
- [ ] Select project type (optional)
- [ ] Click "Lock In Team & Generate Report"
- [ ] Check `data/team-projects.json`
- [ ] Verify email sent to contact@feelize.com
- [ ] Confirm navigation to StartProject page

### **Error Handling:**
- [ ] Try invalid email (no @)
- [ ] Try duplicate email signup
- [ ] Test with backend offline (should still work locally)
- [ ] Test without SMTP configured (should log warning)

---

## 🚀 Deployment Checklist

### **Production Environment:**

1. **Update `.env` on server:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.actual-key-here
   SMTP_FROM=noreply@feelize.com
   ```

2. **Set frontend API URL:**
   ```env
   VITE_API_URL=https://api.feelize.com
   ```

3. **Ensure data directory permissions:**
   ```bash
   chmod 755 Backend/data
   ```

4. **Backup data files regularly:**
   ```bash
   # Add to cron job
   0 0 * * * cp /path/to/Backend/data/*.json /path/to/backups/
   ```

5. **Monitor email logs:**
   ```bash
   # Check server logs for email notifications
   pm2 logs backend | grep "Email sent"
   ```

---

## 📊 Analytics & Monitoring

### **Key Metrics to Track:**

1. **Newsletter Signups:**
   - Total subscribers
   - Signup rate (visitors → signups)
   - Source breakdown

2. **Project Creations:**
   - Total projects
   - Conversion rate (signups → projects)
   - Popular project types
   - Average team size

3. **Email Deliverability:**
   - Successful sends
   - Failed sends
   - Bounce rate

### **Monitoring Script:**

Create `Backend/monitor-stats.js`:
```javascript
const fs = require('fs');

const subscribers = JSON.parse(fs.readFileSync('./data/newsletter-subscribers.json'));
const projects = JSON.parse(fs.readFileSync('./data/team-projects.json'));

console.log('📊 Newsletter Statistics');
console.log('========================');
console.log(`Total Subscribers: ${subscribers.subscribers.length}`);
console.log(`Active Subscribers: ${subscribers.subscribers.filter(s => s.active).length}`);
console.log(`Total Projects: ${projects.projects.length}`);
console.log(`Conversion Rate: ${((projects.projects.length / subscribers.subscribers.length) * 100).toFixed(1)}%`);

// Recent signups (last 7 days)
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const recentSignups = subscribers.subscribers.filter(s => new Date(s.subscribedAt) > weekAgo);
console.log(`Signups (Last 7 Days): ${recentSignups.length}`);
```

Run:
```bash
node monitor-stats.js
```

---

## 🔒 Security Notes

### **Data Protection:**
- ✅ Email addresses stored locally (not in git)
- ✅ `.gitignore` excludes `data/` directory
- ✅ No passwords or sensitive info stored
- ⚠️ Consider GDPR compliance for EU users
- ⚠️ Add unsubscribe functionality (future)

### **Email Security:**
- ✅ Use app passwords (not account passwords)
- ✅ Use environment variables (never hardcode)
- ✅ Enable 2FA on email accounts
- ⚠️ Rotate SMTP passwords regularly
- ⚠️ Monitor for unauthorized access

---

## 🆘 Troubleshooting

### **Problem: Emails Not Sending**

**Check:**
1. Is nodemailer installed? `npm list nodemailer`
2. Are SMTP credentials in `.env`?
3. Run email test: `node test-email.js`
4. Check server logs for errors
5. Verify SMTP port is not blocked by firewall

**Common Issues:**
- Gmail: Enable "Less secure app access" or use app password
- SendGrid: Verify domain and sender identity
- Firewall: Port 587 must be open

### **Problem: "Route not found" Error**

**Check:**
1. Is backend server running? `netstat -ano | findstr ":3000"`
2. Is newsletter routes registered in `server.js`?
3. Check API URL in frontend (should be `http://localhost:3000`)
4. Verify CORS settings allow localhost:5173

### **Problem: Emails Not in Data Files**

**Check:**
1. Backend server running when signup happened?
2. Check file permissions: `ls -la Backend/data/`
3. Look for errors in server logs
4. Verify `data/` directory exists

---

## 📞 Support & Questions

**For implementation help, contact:**
- Technical Lead: [Add contact info]
- DevOps: [Add contact info]

**Useful Commands:**
```bash
# Check if nodemailer is installed
npm list nodemailer

# View backend logs
pm2 logs backend

# Test API endpoint
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check email queue
# (if using a service like SendGrid)
```

---

## ✅ Quick Start Summary

**Minimum required steps to get email notifications working:**

1. Install nodemailer:
   ```bash
   cd Backend
   npm install nodemailer
   ```

2. Configure `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@feelize.com
   ```

3. Test it:
   ```bash
   node test-email.js
   ```

4. Start servers:
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm start

   # Terminal 2 - Frontend
   cd feelize-ai
   npm run dev
   ```

5. Test signup flow and check contact@feelize.com inbox!

---

**Last Updated:** November 8, 2025
**Version:** 1.0.0
**Branch:** newsletter-wall
