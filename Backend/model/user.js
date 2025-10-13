import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    access_level: {
      type: String,
      enum: ["junior", "mid-level", "senior", "lead"],
      default: "junior",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
