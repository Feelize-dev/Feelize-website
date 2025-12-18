import express from "express";
import { recordMeeting, listMeetings } from "../controller/meeting.controller.js";

const router = express.Router();

router.post("/", recordMeeting);
router.get("/", listMeetings);

export default router;
