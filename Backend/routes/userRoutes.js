import express from "express"
import { verifyFirebaseToken } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/sessionLogin", verifyFirebaseToken, createNewUser)

export default router;
