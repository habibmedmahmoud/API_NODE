const express = require("express");
const router = express.Router();
const { getUserNotifications, markAsRead } = require("../controllers/notificationController");
const { verifyToken } = require("../middlewaes/verifyToken");
const validateObjectId = require("../middlewaes/validateObjectId");

router.route("/").get(verifyToken, getUserNotifications);
router.route("/:id/read").put(verifyToken , validateObjectId, markAsRead);

module.exports = router;
