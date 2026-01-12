import Affiliate from "../model/affiliate.js";
import Referral from "../model/referral.js";
import Project from "../model/project.js";
import User from "../model/user.js";

// --- DASHBOARD STATS ---
export const getDashboardStats = async (req, res) => {
    try {
        const totalAffiliates = await Affiliate.countDocuments();
        const totalReferrals = await Referral.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalClients = await User.countDocuments();

        // Calculate total revenue (sum of project budgets/prices - simplified)
        // In a real app, you'd sum actual payments. Here we'll just count projects for now or sum recommended_price if available
        const projects = await Project.find({}, 'recommended_price');
        const totalRevenue = projects.reduce((acc, curr) => acc + (curr.recommended_price || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalAffiliates,
                totalReferrals,
                totalProjects,
                totalClients,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- AFFILIATES MANAGEMENT ---
export const getAffiliates = async (req, res) => {
    try {
        const { status, search } = req.query;
        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { referral_code: { $regex: search, $options: "i" } }
            ];
        }

        const affiliates = await Affiliate.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: affiliates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const approveAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.findByIdAndUpdate(
            req.params.id,
            { status: "active" },
            { new: true }
        );
        if (!affiliate) return res.status(404).json({ success: false, message: "Affiliate not found" });
        res.status(200).json({ success: true, data: affiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateAffiliate = async (req, res) => {
    try {
        console.log("id:", req.params.id, "body:", req.body);
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] === "") {
                delete req.body[key];
            }
        });
        console.log("id:", req.params.id, "body:", req.body);
        const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!affiliate) return res.status(404).json({ success: false, message: "Affiliate not found" });
        res.status(200).json({ success: true, data: affiliate });
    } catch (error) {
        console.log(error);
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

// --- REFERRALS MANAGEMENT ---
export const getReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find()
            .populate("affiliate_id", "name email referral_code")
            .populate("project_id", "client_name project_type status")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: referrals });
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

// --- PROJECTS MANAGEMENT ---
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- CLIENTS MANAGEMENT ---
export const getClients = async (req, res) => {
    try {
        const clients = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] === "") {
                delete req.body[key];
            }
        });
        console.log("Data from front end", req.body);

        const client = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });
        res.status(200).json({ success: true, data: client });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const banClient = async (req, res) => {

    try {

        const client = await User.findByIdAndUpdate(req.params.id,
            {
                isBanned: req.body.isBanned,
                banReason: req.body.banReason,
                banTime: req.body.banTime
            },
            { new: true });

        if (!client) {

            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const unBanClient = async (req, res) => {

    try {
        
        console.log(req.params.id);
        
    } catch (error) {
        
        console.log(error);
        res.json(500).json({

            success:false,
            error: error.message
        })
    }
}