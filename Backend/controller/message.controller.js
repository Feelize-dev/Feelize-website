import Message from "../model/message.js";
import Project from "../model/project.js";

// Get messages for a project
export const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.user;
    const { limit = 50, before } = req.query;

    // Verify project access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { client_email: email },
        { created_by: email }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    // Build query
    const query = { project_id: projectId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    // Get messages
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean()
      .exec();

    // Mark messages as read
    if (messages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: messages.map(m => m._id) },
          read_by: { $ne: email }
        },
        {
          $addToSet: { read_by: email }
        }
      );
    }

    // Format response
    const formattedMessages = messages.map(m => ({
      id: m._id.toString(),
      ...m,
      created_at: m.createdAt.toISOString(),
      updated_at: m.updatedAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: formattedMessages,
      meta: {
        has_more: formattedMessages.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Failed to get project messages:", error);
    return res.status(500).json({
      success: false,
      error: error.message || error
    });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, displayName } = req.user;
    const { content, attachments } = req.body;

    // Validate input
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required"
      });
    }

    // Verify project access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { client_email: email },
        { created_by: email }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    // Create message
    const message = await Message.create({
      project_id: projectId,
      sender_email: email,
      sender_name: displayName || email,
      sender_type: "user",
      content: content.trim(),
      attachments: attachments || [],
      read_by: [email] // Mark as read by sender
    });

    return res.status(201).json({
      success: true,
      data: {
        id: message._id.toString(),
        ...message.toObject(),
        created_at: message.createdAt.toISOString(),
        updated_at: message.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return res.status(500).json({
      success: false,
      error: error.message || error
    });
  }
};