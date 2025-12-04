import Activity from "../model/activity.js";

export const createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find(req.query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: "Activity not found" });
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!activity) return res.status(404).json({ success: false, message: "Activity not found" });
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: "Activity not found" });
        res.status(200).json({ success: true, message: "Activity deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
