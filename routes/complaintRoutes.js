// routes/complaintRoutes.js

const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  respondToComplaint,
} = require("../controllers/complaintController");

const { verifyToken } = require("../middlewaes/verifyToken");

router
  .route("/")
  .post(verifyToken, createComplaint)
  .get(verifyToken, getAllComplaints);

router
  .route("/:id")
  .put(verifyToken, respondToComplaint);

module.exports = router;
