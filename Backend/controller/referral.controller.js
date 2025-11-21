import Referral from "../model/referral.js";

export const createReferral = async (req, res) => {
    try {
        const referral = await Referral.create(req.body);
        res.status(201).json({ success: true, data: referral });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find(req.query).populate("affiliate_id").populate("project_id");
        res.status(200).json({ success: true, data: referrals });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getReferral = async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id).populate("affiliate_id").populate("project_id");
        if (!referral) return res.status(404).json({ success: false, message: "Referral not found" });
        res.status(200).json({ success: true, data: referral });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateReferral = async (req, res) => {
    try {
        const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!referral) return res.status(404).json({ success: false, message: "Referral not found" });
        res.status(200).json({ success: true, data: referral });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteReferral = async (req, res) => {
    try {
        const referral = await Referral.findByIdAndDelete(req.params.id);
        if (!referral) return res.status(404).json({ success: false, message: "Referral not found" });
        res.status(200).json({ success: true, message: "Referral deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
