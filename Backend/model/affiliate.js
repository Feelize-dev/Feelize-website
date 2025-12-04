import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        referral_code: { type: String, required: true, unique: true },
        is_custom_code: { type: Boolean, default: false },
        commission_rate: { type: Number, default: 0.1 }, // 10%
        total_earnings: { type: Number, default: 0 },
        pending_earnings: { type: Number, default: 0 },
        total_referrals: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["active", "suspended", "pending"],
            default: "pending",
        },
        target_audience: { type: String },
        country: { type: String },
        social_media_links: { type: String },
        payment_details: { type: String }, // e.g., PayPal email or bank info
    },
    { timestamps: true }
);

export default mongoose.model("Affiliate", affiliateSchema);
