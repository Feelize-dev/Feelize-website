import express from "express"
import { verifyUserWithToken } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/login", verifyUserWithToken, createNewUser)

export default router;