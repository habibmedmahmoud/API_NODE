const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewaes/verifyToken");
const { createTransaction , getMyTransactions , confirmTransaction ,  cancelTransaction } = require("../controllers/transactionController");
const validateObjectId = require("../middlewaes/validateObjectId");
// إنشاء معاملة جديدة
router.route("/").post(verifyToken, createTransaction)
// جلب المعاملات الخاصة بي
.get(verifyToken, getMyTransactions);


// تأكيد معاملة
router.route("/:id/confirm").put(validateObjectId, verifyToken, confirmTransaction);

// إلغاء معاملة
router.route("/:id/cancel").put(validateObjectId, verifyToken, cancelTransaction)

module.exports = router;
