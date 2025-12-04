import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    assignee_email: { type: String },
    due_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
