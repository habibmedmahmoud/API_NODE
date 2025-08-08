const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

// جلب كل الإشعارات لمستخدم معين
exports.getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

// تمييز إشعار كـ "مقروء"
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification || notification.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ message: "Notification marked as read", notification });
});
