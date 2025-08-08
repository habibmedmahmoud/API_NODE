// routes/mediatorRoutes.js

const express = require("express");
const router = express.Router();
const { createMediator, getAvailableMediators , rateMediator } = require("../controllers/mediatorController");
const { verifyToken } = require("../middlewaes/verifyToken");
const validateObjectId = require("../middlewaes/validateObjectId");


router.route("/").post(verifyToken, createMediator).get(getAvailableMediators);
// ⭐ تقييم وسيط
router.route("/:id/rate").post(verifyToken , validateObjectId , rateMediator)

module.exports = router;
