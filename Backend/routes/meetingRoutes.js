import express from "express";
import { handleCalWebhook, getMeetings, syncMeetingFromFrontend } from "../controller/meeting.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

// Webhook for Cal.com (Public but we should ideally verify Cal.com signature if they provide it)
router.post("/webhook", handleCalWebhook);

// Sync from Frontend (Protected or Public? Public for now as user might not be logged in when booking)
// NOTE: Ideally this should be protected or have some verification, but for public booking pages, it's open.
router.post("/sync", syncMeetingFromFrontend);

// Protected routes
router.get("/", verifySessionMiddleware, getMeetings);

export default router;
