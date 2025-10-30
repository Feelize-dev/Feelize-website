import Project from "../model/project.js";
import Task from "../model/task.js";

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
      complexity_score
    } = req.body;

    // Basic validation
    if (!client_name || !client_email || !project_description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: client_name, client_email or project_description"
      });
    }

    const newProject = await Project.create({
      client_name,
      client_email,
      company_name,
      project_type,
      project_description,
      key_features: Array.isArray(key_features) ? key_features : (key_features ? [key_features] : []),
      design_preferences,
      target_audience,
      uploaded_files: Array.isArray(uploaded_files) ? uploaded_files : (uploaded_files ? [uploaded_files] : []),
      ai_analysis,
      status: status || "completed",
      budget_range,
      timeline,
      project_notes,
      estimated_hours,
      recommended_price,
      complexity_score
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

export default createProject;
