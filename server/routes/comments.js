import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../controllers/comments.js";

const router = express.Router();

/* READ */
router.get("/:postId", verifyToken, getPostComments);

/* CREATE */
router.post("/", verifyToken, createComment);

/* DELETE */
router.delete("/:id", verifyToken, deleteComment);

export default router; 