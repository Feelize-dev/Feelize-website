import express from "express"
import { verifyFirebaseToken, verifySession, verifySessionMiddleware } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";
import { createProject } from "../controller/project.controller.js";

const router = express.Router();

router.get("/sessionLogin", verifyFirebaseToken, createNewUser)
router.get("/verifySession", verifySession)
router.post("/project", verifySessionMiddleware, createProject)

export default router;
