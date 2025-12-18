import express from "express";
import {
    createAffiliate,
    getAffiliates,
    getAffiliate,
    updateAffiliate,
    deleteAffiliate,
    checkReferralCodeAvailability,
    getAffiliateMe // Import the new controller
} from "../controller/affiliate.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifySessionMiddleware, createAffiliate);
router.get("/me", verifySessionMiddleware, getAffiliateMe); // NEW: Get current affiliate
router.get("/", verifySessionMiddleware, getAffiliates);
router.get("/:id", verifySessionMiddleware, getAffiliate);
router.get("/check-code/:code", checkReferralCodeAvailability);
router.put("/:id", verifySessionMiddleware, updateAffiliate);
router.delete("/:id", verifySessionMiddleware, deleteAffiliate);

export default router;
