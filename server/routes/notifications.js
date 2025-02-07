import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createNotification,
  getUserNotifications,
  markNotificationsAsRead,
  getUnreadCount,
} from "../controllers/notifications.js";

const router = express.Router();

/* READ */
router.get("/:userId", verifyToken, getUserNotifications);
router.get("/:userId/unread", verifyToken, getUnreadCount);

/* CREATE */
router.post("/", verifyToken, createNotification);

/* UPDATE */
router.patch("/:userId/read", verifyToken, markNotificationsAsRead);

export default router; 