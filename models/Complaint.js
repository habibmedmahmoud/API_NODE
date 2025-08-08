const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    against: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "role" },
    role: { type: String, enum: ["User", "Mediator"], required: true },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved", "rejected"], default: "pending" },
    response: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
