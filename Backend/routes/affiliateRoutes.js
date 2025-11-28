import express from "express";
import {
    createAffiliate,
    getAffiliates,
    getAffiliate,
    updateAffiliate,
    deleteAffiliate,
    checkReferralCodeAvailability
} from "../controller/affiliate.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifySessionMiddleware, createAffiliate);
router.get("/", verifySessionMiddleware, getAffiliates);
router.get("/:id", verifySessionMiddleware, getAffiliate);
router.get("/check-code/:code", checkReferralCodeAvailability);
router.put("/:id", verifySessionMiddleware, updateAffiliate);
router.delete("/:id", verifySessionMiddleware, deleteAffiliate);

export default router;
