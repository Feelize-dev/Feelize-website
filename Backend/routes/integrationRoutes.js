import express from "express";
import {
    invokeLLM,
    sendEmail,
    uploadFile,
    generateImage,
} from "../controller/integration.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

// LLM
router.post("/llm/invoke", verifySessionMiddleware, invokeLLM);

// Email
router.post("/email/send", verifySessionMiddleware, sendEmail);

// File Upload
router.post("/file/upload", verifySessionMiddleware, uploadFile);

// Image Generation
router.post("/image/generate", verifySessionMiddleware, generateImage);

export default router;
