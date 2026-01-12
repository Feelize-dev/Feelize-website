import Meeting from "../model/meeting.js";
import Referral from "../model/referral.js";
import Affiliate from "../model/affiliate.js";

export const handleCalWebhook = async (req, res) => {
    try {
        const payload = req.body;
        const { triggerEvent, payload: data } = payload;

        console.log(`📩 Received Cal.com Webhook: ${triggerEvent}`);

        if (triggerEvent === "BOOKING_CREATED" || triggerEvent === "BOOKING_RESCHEDULED") {
            const {
                id: cal_booking_id,
                attendees,
                startTime,
                status,
                responses,
                metadata,
            } = data;

            const client = attendees[0];
            const referral_code = metadata?.referral_code || responses?.referral_code || null;

            let affiliate = null;
            if (referral_code) {
                affiliate = await Affiliate.findOne({
                    referral_code: { $regex: new RegExp(`^${referral_code}$`, "i") },
                });
            }

            // Create or update meeting
            const meetingData = {
                cal_booking_id,
                client_name: client.name,
                client_email: client.email,
                meeting_time: new Date(startTime),
                status: status.toLowerCase(),
                form_responses: responses,
                referral_code: referral_code,
                affiliate_id: affiliate?._id || null,
            };

            const meeting = await Meeting.findOneAndUpdate(
                { cal_booking_id },
                meetingData,
                { upsert: true, new: true }
            );

            console.log(`✅ Meeting ${triggerEvent === "BOOKING_CREATED" ? "created" : "updated"}: ${meeting._id}`);

            // Handle Referral if code exists
            if (affiliate) {
                // Check if referral already exists for this meeting
                const existingReferral = await Referral.findOne({ meeting_id: meeting._id });
                if (!existingReferral) {
                    await Referral.create({
                        affiliate_id: affiliate._id,
                        referred_user_email: client.email,
                        meeting_id: meeting._id,
                        status: "booked",
                        conversion_date: new Date(),
                    });

                    await Affiliate.findByIdAndUpdate(affiliate._id, {
                        $inc: { total_referrals: 1 },
                    });
                    console.log(`✅ Referral created for affiliate: ${affiliate.name}`);
                }
            }
        } else if (triggerEvent === "BOOKING_CANCELLED") {
            const { id: cal_booking_id } = data;
            await Meeting.findOneAndUpdate(
                { cal_booking_id },
                { status: "cancelled" }
            );
            console.log(`❌ Meeting cancelled: ${cal_booking_id}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Cal.com Webhook Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMeetings = async (req, res) => {
    try {
        const { email } = req.user;
        // If it's an affiliate, they might want to see meetings they referred
        const affiliate = await Affiliate.findOne({ email });

        let query = {};
        if (affiliate) {
            query.affiliate_id = affiliate._id;
        } else {
            query.client_email = email;
        }

        const meetings = await Meeting.find(query).sort({ meeting_time: -1 });
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        console.error("Failed to fetch meetings:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
