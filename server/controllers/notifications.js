import Notification from "../models/Notification.js";
import User from "../models/User.js";

/* CREATE NOTIFICATION */
export const createNotification = async (req, res) => {
  try {
    const { userId, type, fromUserId, postId, message } = req.body;
    const newNotification = new Notification({
      userId,
      type,
      fromUser: fromUserId,
      postId,
      message,
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* GET USER NOTIFICATIONS */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .populate("fromUser", "firstName lastName picturePath")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* MARK NOTIFICATIONS AS READ */
export const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Bildirimler okundu olarak işaretlendi." });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* GET UNREAD NOTIFICATION COUNT */
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ userId, read: false });
    res.status(200).json({ count });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}; 