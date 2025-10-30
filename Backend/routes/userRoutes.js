import express from "express"
import { verifyFirebaseToken, verifySession, verifySessionMiddleware } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";
import {
	createProject,
	listProjects,
	getProject,
	updateProject,
	generateReport,
} from "../controller/project.controller.js";

import {
  getProjectMessages,
  sendMessage
} from "../controller/message.controller.js";

const router = express.Router();

// Authentication routes
router.get("/sessionLogin", verifyFirebaseToken, createNewUser)
router.get("/verifySession", verifySession)

// Projects API
router.post("/project", verifySessionMiddleware, createProject)
router.get("/projects", verifySessionMiddleware, listProjects)
router.get("/project/:id", verifySessionMiddleware, getProject)
router.put("/project/:id", verifySessionMiddleware, updateProject)
router.post("/project/:id/generate-report", verifySessionMiddleware, generateReport)

// Messages API
router.get("/project/:projectId/messages", verifySessionMiddleware, getProjectMessages)
router.post("/project/:projectId/messages", verifySessionMiddleware, sendMessage)

export default router;
