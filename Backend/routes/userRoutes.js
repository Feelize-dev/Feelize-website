import express from "express"
import { verifyFirebaseToken, verifySession, verifySessionMiddleware } from "../middleware/verifyUser.js";
import { createNewUser, deleteSession } from "../controller/auth.controller.js";
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
router.get("/verify", verifySession, (req, res) => {

	res.status(200).json({

		success: true,
		message: "User data fetched",
		data: req.user
	})
})
router.post("/logout", verifySession, deleteSession)

// Messages API
router.get("/project/:projectId/messages", verifySessionMiddleware, getProjectMessages)
router.post("/project/:projectId/messages", verifySessionMiddleware, sendMessage)

export default router;
