import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    project_id: { type: String, required: true },
    user_email: { type: String, required: true },
    user_name: { type: String, required: true },
    user_role: { type: String },
    activity_type: {
      type: String,
      enum: ["COMMENT", "STATUS_CHANGE", "TASK_UPDATE", "FILE_UPLOAD", "PROJECT_CREATED"],
      required: true,
    },
    description: { type: String, required: true },
    details: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
