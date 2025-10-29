import express from "express"
import { verifyFirebaseToken, verifySession } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/sessionLogin", verifyFirebaseToken, createNewUser)
router.get("/verifySession", verifySession)

export default router;