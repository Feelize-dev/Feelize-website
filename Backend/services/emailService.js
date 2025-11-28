import nodemailer from "nodemailer";
import pkg from 'nodemailer';
const { createTransport } = pkg;

/**
 * Email service for sending project reports and notifications
 */

// Create transporter using environment variables
const createTransporter = () => {
  console.log('   📬 Creating email transporter...');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('   ⚠️  Email credentials not configured in .env');
    console.log('   Missing: EMAIL_USER or EMAIL_PASS');
    return null;
  }

  // If using a named service (gmail, outlook, etc.), use simple service config
  if (process.env.EMAIL_SERVICE && !process.env.SMTP_HOST) {
    console.log(`   ✓ Using named email service: ${process.env.EMAIL_SERVICE}`);
    return (nodemailer.createTransport || createTransport)({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Otherwise, use custom SMTP configuration (for providers like Spacemail)
  console.log(`   ✓ Using custom SMTP configuration:`);
  console.log(`     - Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`     - Port: ${process.env.SMTP_PORT || 587}`);
  console.log(`     - Secure: ${process.env.SMTP_SECURE === 'true'}`);
  console.log(`     - User: ${process.env.EMAIL_USER}`);

  return (nodemailer.createTransport || createTransport)({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send project report to client via email
 * @param {Object} options - Email options
 * @param {string} options.clientEmail - Recipient email address
 * @param {string} options.clientName - Client name
 * @param {string} options.projectType - Type of project
 * @param {string} options.reportContent - Markdown report content
 * @param {string} options.projectId - Project ID
 * @returns {Promise<Object>} - Email sending result
 */
export const sendProjectReport = async ({
  clientEmail,
  clientName,
  projectType,
  reportContent,
  projectId,
}) => {
  try {
    console.log('   📝 Preparing email...');
    console.log(`     - To: ${clientEmail}`);
    console.log(`     - Client Name: ${clientName}`);
    console.log(`     - Project Type: ${projectType}`);

    const transporter = createTransporter();

    if (!transporter) {
      throw new Error('Email service not configured - check EMAIL_USER and EMAIL_PASS in .env');
    }

    console.log('   ✓ Email transporter created successfully');

    // Convert markdown to HTML-friendly format (basic conversion)
    console.log('   🎨 Converting markdown report to HTML...');
    const htmlReport = convertMarkdownToHtml(reportContent);
    console.log(`   ✓ HTML conversion complete (${htmlReport.length} chars)`);

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Feelize Team'} <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `✨ Your Feelize Project Report is Ready - ${projectType || 'Custom Project'}`,
      html: generateEmailTemplate({
        clientName,
        projectType,
        htmlReport,
        projectId,
      }),
      text: generateTextEmail({
        clientName,
        projectType,
        reportContent,
        projectId,
      }),
    };

    console.log('   📤 Sending email via SMTP...');
    const info = await transporter.sendMail(mailOptions);
    console.log(`   ✅ Email sent successfully!`);
    console.log(`     - Message ID: ${info.messageId}`);
    console.log(`     - Response: ${info.response || 'OK'}`);

    return {
      success: true,
      messageId: info.messageId,
      recipient: clientEmail,
    };
  } catch (error) {
    console.error('   ❌ Email sending failed!');
    console.error(`     - Error type: ${error.name}`);
    console.error(`     - Error message: ${error.message}`);
    if (error.code) {
      console.error(`     - Error code: ${error.code}`);
    }
    if (error.command) {
      console.error(`     - Failed command: ${error.command}`);
    }
    throw error;
  }
};

/**
 * Convert basic markdown to HTML
 * @param {string} markdown - Markdown content
 * @returns {string} - HTML content
 */
const convertMarkdownToHtml = (markdown) => {
  if (!markdown) return '';

  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="color: #2563eb; margin-top: 24px; margin-bottom: 12px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #1e40af; margin-top: 32px; margin-bottom: 16px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e3a8a; margin-top: 40px; margin-bottom: 20px;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li style="margin-bottom: 8px;">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p style="margin: 12px 0;">')
    .replace(/\n/g, '<br>');
};

/**
 * Generate professional HTML email template
 */
const generateEmailTemplate = ({ clientName, projectType, htmlReport, projectId }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Feelize Project Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🚀 Feelize
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
                Professional Project Analysis
              </p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px;">
              <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 600;">
                Hi ${clientName || 'there'} 👋
              </h2>
              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for submitting your project to Feelize! We've completed a comprehensive analysis of your <strong>${projectType || 'project'}</strong>, and your detailed report is ready.
              </p>
            </td>
          </tr>
          
          <!-- Report Section -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 12px; color: #374151; font-size: 18px; font-weight: 600;">
                  📊 Your Project Report
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Project ID: <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${projectId}</code>
                </p>
              </div>
              
              <!-- Report Content -->
              <div style="color: #374151; font-size: 15px; line-height: 1.7;">
                ${htmlReport}
              </div>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
                <p style="margin: 0 0 16px; color: #1e40af; font-size: 16px; font-weight: 600;">
                  Ready to bring your project to life?
                </p>
                <a href="https://feelize.com/contact" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Let's Get Started
                </a>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Have questions? Reply to this email or contact us at 
                <a href="mailto:contact@feelizecode.com" style="color: #667eea; text-decoration: none;">contact@feelizecode.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-align: center;">
                This report was generated by Feelize AI-powered analysis
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Feelize. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Generate plain text email
 */
const generateTextEmail = ({ clientName, projectType, reportContent, projectId }) => {
  return `
Hi ${clientName || 'there'},

Thank you for submitting your project to Feelize! We've completed a comprehensive analysis of your ${projectType || 'project'}, and your detailed report is ready.

PROJECT ID: ${projectId}

========================================
YOUR PROJECT REPORT
========================================

${reportContent}

========================================

Ready to bring your project to life? Contact us at contact@feelizecode.com

Have questions? Reply to this email or visit https://feelize.com

---
This report was generated by Feelize AI-powered analysis
© ${new Date().getFullYear()} Feelize. All rights reserved.
  `.trim();
};

export default { sendProjectReport };
