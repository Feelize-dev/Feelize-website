import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true }, // Not required for initial guest/otp users 
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    otp: { type: String },            // Stores the current OTP
    otpExpires: { type: Date },       // Expiration time for OTP
    access_level: {
      type: String,
      enum: ["junior", "mid-level", "senior", "lead"],
      default: "junior",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
