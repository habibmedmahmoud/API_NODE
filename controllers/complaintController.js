// controllers/complaintController.js

const Complaint = require("../models/Complaint");
const asyncHandler = require("express-async-handler");

// 🟢 إنشاء شكوى جديدة
exports.createComplaint = asyncHandler(async (req, res) => {
  const { against, role, transaction, reason } = req.body;

  if (!against || !role || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const complaint = await Complaint.create({
    user: req.user.id,
    against,
    role,
    transaction,
    reason,
  });

  res.status(201).json({ message: "Complaint submitted", complaint });
});

// 🟡 عرض جميع الشكاوى (للأدمن فقط)
exports.getAllComplaints = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  const complaints = await Complaint.find()
    .populate("user", "name email")
    .populate("against", "name email")
    .populate("transaction");

  res.status(200).json({ complaints });
});

// 🔵 الرد على شكوى (تحديث حالتها)
exports.respondToComplaint = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const { status, response } = req.body;

  if (!["resolved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  complaint.status = status;
  complaint.response = response;
  await complaint.save();

  res.status(200).json({ message: "Complaint updated", complaint });
});
