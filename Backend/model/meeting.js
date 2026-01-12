import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
    {
        cal_booking_id: { type: Number, required: true, unique: true },
        client_name: { type: String, required: true },
        client_email: { type: String, required: true },
        meeting_time: { type: Date, required: true },
        status: {
            type: String,
            enum: ["scheduled", "cancelled", "rescheduled", "completed"],
            default: "scheduled",
        },
        form_responses: { type: mongoose.Schema.Types.Mixed },
        referral_code: { type: String },
        affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliate" },
    },
    { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
