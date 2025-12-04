import express from "express";
import {
    createProject,
    listProjects,
    getProject,
    updateProject,
    generateReport,
} from "../controller/project.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

// Standard RESTful routes
router.post("/", verifySessionMiddleware, createProject);
router.get("/", verifySessionMiddleware, listProjects);
router.get("/:id", verifySessionMiddleware, getProject);
router.put("/:id", verifySessionMiddleware, updateProject);
router.post("/:id/generate-report", verifySessionMiddleware, generateReport);

export default router;
