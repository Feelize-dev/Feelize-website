import express from "express";
import {
    createEngineer,
    getEngineers,
    getEngineer,
    updateEngineer,
    deleteEngineer,
} from "../controller/engineer.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

// Protect all routes with session verification if needed, or expose public read
router.post("/", verifySessionMiddleware, createEngineer);
router.get("/", getEngineers); // Publicly list engineers?
router.get("/:id", getEngineer);
router.put("/:id", verifySessionMiddleware, updateEngineer);
router.delete("/:id", verifySessionMiddleware, deleteEngineer);

export default router;
