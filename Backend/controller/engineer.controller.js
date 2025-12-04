import Engineer from "../model/engineer.js";

export const createEngineer = async (req, res) => {
    try {
        const engineer = await Engineer.create(req.body);
        res.status(201).json({ success: true, data: engineer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEngineers = async (req, res) => {
    try {
        const engineers = await Engineer.find(req.query);
        res.status(200).json({ success: true, data: engineers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEngineer = async (req, res) => {
    try {
        const engineer = await Engineer.findById(req.params.id);
        if (!engineer) return res.status(404).json({ success: false, message: "Engineer not found" });
        res.status(200).json({ success: true, data: engineer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateEngineer = async (req, res) => {
    try {
        const engineer = await Engineer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!engineer) return res.status(404).json({ success: false, message: "Engineer not found" });
        res.status(200).json({ success: true, data: engineer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteEngineer = async (req, res) => {
    try {
        const engineer = await Engineer.findByIdAndDelete(req.params.id);
        if (!engineer) return res.status(404).json({ success: false, message: "Engineer not found" });
        res.status(200).json({ success: true, message: "Engineer deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
