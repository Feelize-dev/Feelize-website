import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
    experience_years: { type: Number },
    rate_per_hour: { type: Number },
    status: {
      type: String,
      enum: ["available", "busy", "inactive"],
      default: "available",
    },
    bio: { type: String },
    portfolio_url: { type: String },
    github_url: { type: String },
    linkedin_url: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Engineer", engineerSchema);
