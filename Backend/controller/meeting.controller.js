import Meeting from "../model/meeting.js";

export const recordMeeting = async (req, res) => {
    try {
        const { client_name, client_email, meeting_date, referral_code, cal_event_id, metadata } = req.body;

        const newMeeting = await Meeting.create({
            client_name,
            client_email,
            meeting_date,
            referral_code,
            cal_event_id,
            metadata
        });

        return res.status(201).json({ success: true, data: newMeeting });
    } catch (error) {
        console.error("Failed to record meeting:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const listMeetings = async (req, res) => {
    try {
        // Basic list for admin
        const meetings = await Meeting.find().sort({ createdAt: -1 }).limit(50);
        return res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        console.error("Failed to list meetings:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
