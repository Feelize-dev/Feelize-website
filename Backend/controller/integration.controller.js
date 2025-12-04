import { generateWithLLM } from "../services/llmService.js";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";

// --- LLM Integration ---
export const invokeLLM = async (req, res) => {
    try {
        const { prompt, response_json_schema } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        let finalPrompt = prompt;
        if (response_json_schema) {
            finalPrompt += `\n\nPlease provide the response in the following JSON format:\n${JSON.stringify(response_json_schema, null, 2)}`;
        }

        const response = await generateWithLLM(finalPrompt);

        // If schema is requested, try to parse JSON
        if (response_json_schema) {
            try {
                // Extract JSON from potential markdown code blocks
                const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/{[\s\S]*}/);
                const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;
                const parsed = JSON.parse(jsonString);
                return res.status(200).json({ success: true, data: parsed });
            } catch (e) {
                console.warn("Failed to parse LLM response as JSON:", e);
                // Fallback to raw text if parsing fails
                return res.status(200).json({ success: true, data: response, warning: "Failed to parse JSON" });
            }
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("LLM Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Email Integration ---
// Configure transporter (using environment variables recommended)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(503).json({ success: false, message: "Email service not configured (missing env vars)" });
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });

        res.status(200).json({ success: true, message: "Email sent", messageId: info.messageId });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- File Upload Integration ---
// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('file'); // Expecting form-data field name 'file'

export const uploadFile = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, error: err.message });
        } else if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Construct public URL (assuming static file serving is set up)
        const fileUrl = `${req.protocol}://${req.get('host')}/data/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                filename: req.file.filename,
                url: fileUrl,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    });
};

// --- Image Generation (Placeholder) ---
export const generateImage = async (req, res) => {
    // Placeholder: In a real app, call OpenAI DALL-E or similar
    res.status(501).json({ success: false, message: "Image generation not implemented yet" });
};
