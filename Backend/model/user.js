import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    access_level: {
      type: String,
      enum: ["junior", "mid-level", "senior", "lead"],
      default: "junior",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
