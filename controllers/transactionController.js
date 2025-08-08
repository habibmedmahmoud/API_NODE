const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

// إنشاء معاملة جديدة
exports.createTransaction = asyncHandler(async (req, res) => {
  const { offerId, receiverId } = req.body;

  const transaction = await Transaction.create({
    offer: offerId,
    sender: req.user.id,
    receiver: receiverId,
  });

  res.status(201).json(transaction);
});

// جلب المعاملات الخاصة بالمستخدم
exports.getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ sender: req.user.id }, { receiver: req.user.id }],
  }).populate("offer sender receiver");

  res.status(200).json(transactions);
});

// تأكيد المعاملة
exports.confirmTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (transaction.receiver.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  transaction.status = "confirmed";
  transaction.confirmedAt = new Date();
  await transaction.save();

  res.status(200).json({ message: "Transaction confirmed", transaction });
});

// إلغاء المعاملة
exports.cancelTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (
    transaction.sender.toString() !== req.user.id &&
    transaction.receiver.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  transaction.status = "cancelled";
  await transaction.save();

  res.status(200).json({ message: "Transaction cancelled", transaction });
});
