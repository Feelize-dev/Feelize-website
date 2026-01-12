import express from "express";
import {
    getDashboardStats,
    getAffiliates,
    approveAffiliate,
    updateAffiliate,
    deleteAffiliate,
    getReferrals,
    updateReferral,
    getProjects,
    updateProject,
    getClients,
    updateClient,
    banClient,
    unBanClient
} from "../controller/admin.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

// Middleware to ensure user is admin (You should add a specific admin check middleware here later)
// For now, we'll just check if they are logged in.
// TODO: Add verifyAdminMiddleware
router.use(verifySessionMiddleware);

// Dashboard
router.get("/dashboard-stats", getDashboardStats);

// Affiliates
router.get("/affiliates", getAffiliates);
router.put("/affiliates/:id/approve", approveAffiliate);
router.patch("/affiliates/:id", updateAffiliate);
router.delete("/affiliates/:id", deleteAffiliate);

// Referrals
router.get("/referrals", getReferrals);
router.put("/referrals/:id", updateReferral);

// Projects
router.get("/projects", getProjects);
router.put("/projects/:id", updateProject);

// Clients
router.get("/clients", getClients);
router.patch("/clients/:id", updateClient);
router.patch("/clients/ban/:id", banClient); 
router.patch("/clients/unban/:id", unBanClient);

export default router;
