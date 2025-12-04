import express from "express";
import {
    createReferral,
    getReferrals,
    getReferral,
    updateReferral,
    deleteReferral,
} from "../controller/referral.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifySessionMiddleware, createReferral);
router.get("/", verifySessionMiddleware, getReferrals);
router.get("/:id", verifySessionMiddleware, getReferral);
router.put("/:id", verifySessionMiddleware, updateReferral);
router.delete("/:id", verifySessionMiddleware, deleteReferral);

export default router;
