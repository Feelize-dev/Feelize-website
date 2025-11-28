import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    client_name: { type: String, required: true },
    client_email: { type: String, required: true },
    company_name: { type: String },
    project_type: {
      type: String,
      enum: ["website", "web_app", "ecommerce", "mobile_app", "redesign", "other"],
    },
    project_description: { type: String, required: true },
    budget_range: {
      type: String,
      enum: ["under_5k", "5k_15k", "15k_50k", "50k_plus", "not_sure"],
    },
    timeline: { type: String },
    key_features: { type: [String], default: [] },
    design_preferences: { type: String },
    target_audience: { type: String },
    uploaded_files: { type: [String], default: [] },
    conversation_transcript: { type: String },
    ai_analysis: { type: String },
    status: {
      type: String,
      enum: ["draft", "completed", "contacted", "in_progress", "delivered", "cancelled"],
      default: "draft",
    },
    professional_report_html: { type: String },
    internal_team_report: { type: String },
    estimated_hours: { type: Number },
    recommended_price: { type: Number },
    complexity_score: { type: Number, min: 1, max: 10 },
    assigned_team: { type: [String], default: [] }, // list of emails
    project_notes: { type: String },
    referral_code: { type: String }, // Store the code used to create this project
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
