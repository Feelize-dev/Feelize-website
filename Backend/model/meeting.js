import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
    {
        client_name: { type: String },
        client_email: { type: String },
        meeting_date: { type: Date },
        referral_code: { type: String },
        cal_event_id: { type: String },
        status: { type: String, default: "scheduled" }, // scheduled, cancelled
        metadata: { type: Object }, // Store full payload
    },
    { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
