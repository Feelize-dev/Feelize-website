import Affiliate from "../model/affiliate.js";

export const createAffiliate = async (req, res) => {
    try {
        const { name, email, referral_code, payment_method, payment_details, why_join } = req.body;

        // Check if affiliate already exists
        const existingAffiliate = await Affiliate.findOne({ email });
        if (existingAffiliate) {
            return res.status(400).json({ success: false, message: "Affiliate with this email already exists" });
        }

        // Validate custom referral code if provided
        let finalReferralCode = referral_code;
        let isCustom = false;

        if (referral_code) {
            // Check if code is taken
            const codeExists = await Affiliate.findOne({ referral_code });
            if (codeExists) {
                return res.status(400).json({ success: false, message: "Referral code is already taken" });
            }
            // Basic validation (alphanumeric, 4-12 chars)
            const codeRegex = /^[A-Z0-9]{4,12}$/;
            if (!codeRegex.test(referral_code)) {
                return res.status(400).json({ success: false, message: "Invalid referral code format (4-12 alphanumeric characters)" });
            }
            isCustom = true;
        } else {
            // Generate random code if not provided
            const prefix = email.split("@")[0].toUpperCase().slice(0, 4);
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            finalReferralCode = `${prefix}${random}`;
        }

        const affiliate = await Affiliate.create({
            name,
            email,
            referral_code: finalReferralCode,
            is_custom_code: isCustom,
            payment_details: JSON.stringify({ method: payment_method, details: payment_details }), // Store as string or object
            status: "pending", // Default to pending for approval
            target_audience: why_join
        });

        res.status(201).json({ success: true, data: affiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const checkReferralCodeAvailability = async (req, res) => {
    try {
        const { code } = req.params;
        const affiliate = await Affiliate.findOne({ referral_code: code });
        if (affiliate) {
            return res.status(200).json({ available: false });
        }
        res.status(200).json({ available: true });
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
