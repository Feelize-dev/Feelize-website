import express from "express";
import {
    createActivity,
    getActivities,
    getActivity,
    updateActivity,
    deleteActivity,
} from "../controller/activity.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifySessionMiddleware, createActivity);
router.get("/", verifySessionMiddleware, getActivities);
router.get("/:id", verifySessionMiddleware, getActivity);
router.put("/:id", verifySessionMiddleware, updateActivity);
router.delete("/:id", verifySessionMiddleware, deleteActivity);

export default router;
