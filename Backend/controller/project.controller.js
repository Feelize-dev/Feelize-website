import Project from "../model/project.js";
import Task from "../model/task.js";
import Affiliate from "../model/affiliate.js";
import Referral from "../model/referral.js";
import { generateWithLLM } from "../services/llmService.js";
import { sendProjectReport } from "../services/emailService.js";

// Create a new project from StartProject form
export const createProject = async (req, res) => {
  try {
    // req.user is provided by verifySessionMiddleware
    const user = req.user;

    const {
      client_name,
      client_email,
      company_name,
      project_type,
      project_description,
      key_features,
      design_preferences,
      target_audience,
      uploaded_files,
      ai_analysis,
      status,
      budget_range,
      timeline,
      project_notes,
      estimated_hours,
      recommended_price,
      complexity_score,
      referral_code, // Extract referral code
    } = req.body;

    // Basic validation
    if (!client_name || !client_email || !project_description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: client_name, client_email or project_description",
      });
    }

    const newProject = await Project.create({
      client_name,
      client_email,
      company_name,
      project_type: project_type || undefined, // Treat empty string as not provided
      project_description,
      key_features: Array.isArray(key_features) ? key_features : key_features ? [key_features] : [],
      design_preferences,
      target_audience,
      uploaded_files: Array.isArray(uploaded_files) ? uploaded_files : uploaded_files ? [uploaded_files] : [],
      ai_analysis,
      status: status || "completed",
      budget_range: budget_range || undefined, // Treat empty string as not provided
      timeline,
      project_notes,
      estimated_hours,
      recommended_price,
      complexity_score,
      referral_code, // Save the referral code directly on the project
    });

    // Handle Referral
    if (referral_code) {
      console.log(`🔍 Processing referral code: "${referral_code}"`);
      try {
        // Case-insensitive lookup
        const affiliate = await Affiliate.findOne({
          referral_code: { $regex: new RegExp(`^${referral_code}$`, "i") }
        });

        if (affiliate) {
          console.log(`✅ Affiliate found: ${affiliate.name} (${affiliate._id})`);

          const newReferral = await Referral.create({
            affiliate_id: affiliate._id,
            referred_user_email: client_email,
            project_id: newProject._id,
            status: "pending",
            commission_amount: 0, // Will be calculated later based on project value
            conversion_date: new Date(),
          });
          console.log(`✅ Referral created: ${newReferral._id}`);

          // Update affiliate stats
          const updatedAffiliate = await Affiliate.findByIdAndUpdate(affiliate._id, {
            $inc: { total_referrals: 1 }
          }, { new: true });
          console.log(`📈 Affiliate stats updated. New total referrals: ${updatedAffiliate.total_referrals}`);

        } else {
          console.warn(`⚠️  Referral code "${referral_code}" provided but no matching affiliate found.`);
        }
      } catch (referralError) {
        console.error("❌ Error processing referral:", referralError);
        // Don't fail the project creation if referral fails
      }
    } else {
      console.log("ℹ️  No referral code provided for this project.");
    }

    // Optionally create tasks if provided in body.tasks
    if (Array.isArray(req.body.tasks) && req.body.tasks.length > 0) {
      const taskDocs = req.body.tasks.map((t) => ({
        project_id: newProject._id.toString(),
        title: t.title || "",
        description: t.description || "",
        assignee_email: t.assignee_email || null,
        due_date: t.due_date ? new Date(t.due_date) : new Date(),
        status: t.status || "todo",
      }));

      await Task.insertMany(taskDocs);
    }

    // Automatically generate professional report and send email if ai_analysis exists
    if (newProject.ai_analysis && newProject.client_email) {
      console.log('\n📊 Auto-generating professional report...');

      try {
        const reportPrompt = `
          You are representing Feelize, a premium software service company with decades of experience.

          **CRITICAL INSTRUCTIONS:**
          - Output ONLY markdown sections - NO preamble, NO titles, NO metadata
          - DO NOT include: "Date:", "Prepared For:", "Project:", "Analysis by:", document titles, or ANY header text before the first section
          - Start IMMEDIATELY with: ## Executive Summary
          - Use "we / our team / Feelize recommends" throughout
          - Each section = MAXIMUM 3 paragraphs (2-4 sentences each)
          - Be direct and specific - reference customer's exact inputs
          - NO generic filler, NO buzzwords, NO fluff

          **CUSTOMER'S PROJECT INFORMATION:**
          - Customer Name: ${newProject.client_name}
          - Company: ${newProject.company_name || 'N/A'}
          - Project Type: ${newProject.project_type}
          - Budget Range: ${newProject.budget_range}
          - Expected Timeline: ${newProject.timeline}
          - Project Description: ${newProject.project_description}
          - Initial Analysis: ${newProject.ai_analysis}

          **FEELIZE SERVICE TIERS & PRICING:**
          1. Campaign Site: $2,999 (1-2 weeks) - Landing pages, lead forms, basic analytics
          2. E-commerce Pro: $7,999 (4-6 weeks) - Full store, up to 100 products, payments, inventory
          3. SaaS Platform: $20,000+ (8-16 weeks) - Custom web app, auth, database, subscriptions, cloud
          4. Hourly Rate: $75/hr - On-demand tasks, maintenance, consultations

          **REQUIRED SECTIONS (3 paragraphs max each):**
          ## Executive Summary
          ## Technical Architecture & Our Recommendations
          ## UX & Design Strategy
          ## Development Roadmap & Milestones
          ## Investment Breakdown
          ## Risks & Mitigation
          ## Success Metrics
          ## Next Steps

          Start your response with "## Executive Summary" (no other text before it):
        `;

        console.log('🤖 Calling Gemini to generate report...');
        const markdownReport = await generateWithLLM(reportPrompt);

        console.log(`✅ Report generated (${markdownReport.length} characters)`);

        // Save report to project
        newProject.professional_report_html = markdownReport;
        await newProject.save();
        console.log('💾 Report saved to project');

        // Send email with report
        console.log(`📧 Sending report to ${newProject.client_email}...`);
        console.log(`   - SMTP Host: ${process.env.SMTP_HOST || 'Not set'}`);
        console.log(`   - Email User: ${process.env.EMAIL_USER ? 'Configured' : 'Not set'}`);

        await sendProjectReport({
          clientEmail: newProject.client_email,
          clientName: newProject.client_name,
          projectType: newProject.project_type,
          reportContent: markdownReport,
          projectId: newProject._id.toString(),
        });

        console.log(`✅ Report email sent successfully to ${newProject.client_email}\n`);
      } catch (reportError) {
        console.error('⚠️  Failed to generate/send report (project still created):', reportError.message);
        // Don't fail project creation if report generation fails
      }
    } else {
      if (!newProject.ai_analysis) {
        console.log('⏭️  Skipping report generation: No AI analysis provided');
      }
      if (!newProject.client_email) {
        console.log('⏭️  Skipping email: No client email provided');
      }
    }

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
};

// List projects with filtering and sorting. Returns array of projects.
export const listProjects = async (req, res) => {
  try {
    const { email } = req.user; // From verifySessionMiddleware
    const { status, sort = '-created_date', limit = 50 } = req.query;

    // Build query
    const query = {
      $or: [
        { client_email: email },
        { created_by: email }
      ]
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Execute query with sorting and limit
    const projects = await Project.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .lean()
      .exec();

    // Map to front-end shape and format dates
    const mapped = projects.map((p) => ({
      id: p._id.toString(),
      ...p,
      created_date: p.createdAt.toISOString(),
      updated_date: p.updatedAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: mapped,
      meta: {
        total: mapped.length,
        has_more: mapped.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Failed to list projects:", error);
    return res.status(500).json({
      success: false,
      error: error.message || error
    });
  }
};

// Get single project by id with associated tasks
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user; // From verifySessionMiddleware

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: id,
      $or: [
        { client_email: email },
        { created_by: email }
      ]
    }).lean().exec();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    // Get associated tasks
    const tasks = await Task.find({
      project_id: id
    }).sort({
      status: 1,
      due_date: 1
    }).lean().exec();

    // Format response
    const response = {
      id: project._id.toString(),
      ...project,
      created_date: project.createdAt.toISOString(),
      updated_date: project.updatedAt.toISOString(),
      tasks: tasks.map(t => ({
        id: t._id.toString(),
        ...t,
        due_date: t.due_date.toISOString()
      }))
    };

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Failed to get project:", error);
    return res.status(500).json({
      success: false,
      error: error.message || error
    });
  }
};

// Update project (partial update)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const updated = await Project.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
    if (!updated) return res.status(404).json({ success: false, message: "Project not found" });
    return res.status(200).json({ success: true, data: { id: updated._id.toString(), ...updated } });
  } catch (error) {
    console.error("Failed to update project:", error);
    return res.status(500).json({ success: false, error: error.message || error });
  }
};

// Generate professional HTML report using LLM and save to project.professional_report_html
export const generateReport = async (req, res) => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 GENERATE REPORT - STARTED');
  console.log('='.repeat(60));

  try {
    const { id } = req.params;
    console.log(`📋 Step 1: Fetching project with ID: ${id}`);

    const project = await Project.findById(id).exec();
    if (!project) {
      console.log('❌ Project not found');
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    console.log(`✅ Step 1 Complete: Project found`);
    console.log(`   - Client: ${project.client_name}`);
    console.log(`   - Email: ${project.client_email}`);
    console.log(`   - Type: ${project.project_type}`);

    // Updated prompt to generate a clean, professional Markdown report.
    const prompt = `
      You are representing Feelize, a premium software service company with decades of experience.

      **CRITICAL INSTRUCTIONS:**
      - Output ONLY markdown sections - NO preamble, NO titles, NO metadata
      - DO NOT include: "Date:", "Prepared For:", "Project:", "Analysis by:", document titles, or ANY header text before the first section
      - Start IMMEDIATELY with: ## Executive Summary
      - Use "we / our team / Feelize recommends" throughout
      - Each section = MAXIMUM 3 paragraphs (2-4 sentences each)
      - Be direct and specific - reference customer's exact inputs
      - NO generic filler, NO buzzwords, NO fluff

      **CUSTOMER'S PROJECT INFORMATION:**
      - Customer Name: ${project.client_name}
      - Company: ${project.company_name || 'N/A'}
      - Project Type: ${project.project_type}
      - Budget Range: ${project.budget_range}
      - Expected Timeline: ${project.timeline}
      - Project Description: ${project.project_description}
      - Initial Analysis: ${project.ai_analysis}

      **FEELIZE SERVICE TIERS & PRICING:**
      1. Campaign Site: $2,999 (1-2 weeks) - Landing pages, lead forms, basic analytics
      2. E-commerce Pro: $7,999 (4-6 weeks) - Full store, up to 100 products, payments, inventory
      3. SaaS Platform: $20,000+ (8-16 weeks) - Custom web app, auth, database, subscriptions, cloud
      4. Hourly Rate: $75/hr - On-demand tasks, maintenance, consultations

      **REQUIRED SECTIONS (3 paragraphs max each):**
      ## Executive Summary
      ## Technical Architecture & Our Recommendations
      ## UX & Design Strategy
      ## Development Roadmap & Milestones
      ## Investment Breakdown
      ## Risks & Mitigation
      ## Success Metrics
      ## Next Steps

      Start your response with "## Executive Summary" (no other text before it):
    `;

    console.log(`\n🤖 Step 2: Calling Gemini LLM to generate report...`);
    console.log(`   - Prompt length: ${prompt.length} characters`);

    // Call LLM service
    const markdownReport = await generateWithLLM(prompt);

    console.log(`✅ Step 2 Complete: Report generated by Gemini`);
    console.log(`   - Report length: ${markdownReport.length} characters`);

    console.log(`\n💾 Step 3: Saving report to database...`);
    project.professional_report_html = markdownReport; // Storing Markdown in this field
    await project.save();
    console.log(`✅ Step 3 Complete: Report saved to project`);

    // Send project report via email if client email is provided
    if (project.client_email) {
      console.log(`\n📧 Step 4: Sending email to ${project.client_email}...`);
      console.log(`   - Email service configured: ${process.env.EMAIL_USER ? 'YES' : 'NO'}`);
      console.log(`   - SMTP Host: ${process.env.SMTP_HOST || 'Not set'}`);
      console.log(`   - SMTP Port: ${process.env.SMTP_PORT || 'Not set'}`);

      try {
        await sendProjectReport({
          clientEmail: project.client_email,
          clientName: project.client_name,
          projectType: project.project_type,
          reportContent: markdownReport,
          projectId: project._id.toString(),
        });
        console.log(`✅ Step 4 Complete: Email sent successfully to ${project.client_email}`);
      } catch (emailError) {
        console.log(`⚠️  Step 4 Warning: Email sending failed (continuing anyway)`);
        console.error(`   Error details: ${emailError.message}`);
        console.error(`   Full error:`, emailError);
        // Don't fail the request if email fails, just log the error
      }
    } else {
      console.log(`\n⏭️  Step 4 Skipped: No client email provided`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ GENERATE REPORT - COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60) + '\n');

    return res.status(200).json({ success: true, data: { id: project._id.toString(), professional_report_html: markdownReport } });
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ GENERATE REPORT - FAILED');
    console.log('='.repeat(60));
    console.error("Error details:", error.message);
    console.error("Full error:", error);
    console.log('='.repeat(60) + '\n');

    return res.status(500).json({ success: false, error: error.message || error });
  }
};

export default createProject;
