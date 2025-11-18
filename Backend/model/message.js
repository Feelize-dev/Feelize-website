import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    project_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    sender_email: { 
      type: String, 
      required: true 
    },
    sender_name: { 
      type: String 
    },
    sender_type: { 
      type: String, 
      enum: ["user", "team", "system"],
      required: true
    },
    content: { 
      type: String, 
      required: true 
    },
    attachments: {
      type: [{
        name: String,
        url: String,
        type: String
      }],
      default: []
    },
    read_by: {
      type: [String], // List of user emails who have read the message
      default: []
    }
  },
  { 
    timestamps: true 
  }
);

// Index for efficient queries
messageSchema.index({ project_id: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);