import { Router } from "express";

import { authenticateJWT } from "../middleware/auth";
import { getTodo, createTodo, updateTodo, deleteTodo } from "../controllers/todoController";

const router = Router();

router.get("/", authenticateJWT, getTodo);
router.post("/", authenticateJWT, createTodo);
router.put("/:id", authenticateJWT, updateTodo);
router.delete("/:id", authenticateJWT, deleteTodo);

export default router;
