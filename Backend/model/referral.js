import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
    {
        affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliate", required: true },
        referred_user_email: { type: String, required: true },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
        status: {
            type: String,
            enum: ["pending", "converted", "paid", "rejected", "booked"],
            default: "pending",
        },
        commission_amount: { type: Number, default: 0 },
        conversion_date: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);
