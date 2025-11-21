import express from "express";
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
} from "../controller/task.controller.js";
import { verifySessionMiddleware } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifySessionMiddleware, createTask);
router.get("/", verifySessionMiddleware, getTasks);
router.get("/:id", verifySessionMiddleware, getTask);
router.put("/:id", verifySessionMiddleware, updateTask);
router.delete("/:id", verifySessionMiddleware, deleteTask);

export default router;
