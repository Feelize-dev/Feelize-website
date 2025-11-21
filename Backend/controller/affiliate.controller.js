import Affiliate from "../model/affiliate.js";

export const createAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.create(req.body);
        res.status(201).json({ success: true, data: affiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAffiliates = async (req, res) => {
    try {
        const affiliates = await Affiliate.find(req.query);
        res.status(200).json({ success: true, data: affiliates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findById(req.params.id);
        if (!affiliate) return res.status(404).json({ success: false, message: "Affiliate not found" });
        res.status(200).json({ success: true, data: affiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!affiliate) return res.status(404).json({ success: false, message: "Affiliate not found" });
        res.status(200).json({ success: true, data: affiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findByIdAndDelete(req.params.id);
        if (!affiliate) return res.status(404).json({ success: false, message: "Affiliate not found" });
        res.status(200).json({ success: true, message: "Affiliate deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
