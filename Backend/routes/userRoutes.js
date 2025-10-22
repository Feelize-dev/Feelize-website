import express from "express"
import { verifyUser, verifyUserWithToken } from "../middleware/verifyUser.js";
import { createNewUser } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/sessionLogin", verifyUserWithToken, createNewUser)

export default router;