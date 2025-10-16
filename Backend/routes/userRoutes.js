import express from "express"
import { verifyUserWithToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/verify", verifyUserWithToken)

export default router;