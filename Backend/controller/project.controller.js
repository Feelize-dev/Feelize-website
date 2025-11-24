import Project from "../model/project.js";
import Task from "../model/task.js";
import { generateWithLLM } from "../services/llmService.js";

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
    });

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
  try {
    const { id } = req.params;
    const project = await Project.findById(id).exec();
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Updated prompt to generate a clean, professional Markdown report.
    const prompt = `
      You are a top-tier project manager and technical consultant. Based on the following project data, create a comprehensive and professional project analysis report in **Markdown format**.

      **Project Data:**
      - Client: ${project.client_name}
      - Company: ${project.company_name || 'N/A'}
      - Project Type: ${project.project_type}
      - Budget: ${project.budget_range}
      - Timeline: ${project.timeline}
      - Description: ${project.project_description}
      - AI Analysis Summary: ${project.ai_analysis}

      **Report Structure:**
      The report must be well-structured, easy to read, and professional. Use clear headings, bullet points, and bold text to organize the information.

      **Required Sections:**
      1.  **Executive Summary:** A brief overview of the project and key recommendations.
      2.  **Technical Requirements & Recommendations:** Platform, performance, features, security.
      3.  **Design Direction & User Experience (UX) Strategy:** UX research, wireframes, UI design, and user testing.
      4.  **Development Timeline & Milestones:** A proposed timeline with key deliverables for each phase.
      5.  **Budget Allocation & Cost Optimization:** A breakdown of the budget and strategies to optimize costs.
      6.  **Potential Challenges & Solutions:** Identify potential risks and propose mitigation strategies.
      7.  **Success Metrics & KPIs:** How to measure the project's success post-launch.
      8.  **Conclusion:** A summary of the plan and next steps.

      **IMPORTANT:**
      - The output **MUST** be only the Markdown report.
      - Do **NOT** include any HTML, CSS, or any other code.
      - Do **NOT** include the original AI Analysis content, only use it as a reference to write the report sections.
    `;

    // Call LLM service
    const markdownReport = await generateWithLLM(prompt);

    project.professional_report_html = markdownReport; // Storing Markdown in this field
    await project.save();

    return res.status(200).json({ success: true, data: { id: project._id.toString(), professional_report_html: markdownReport } });
  } catch (error) {
    console.error("Failed to generate report:", error);
    return res.status(500).json({ success: false, error: error.message || error });
  }
};

export default createProject;
