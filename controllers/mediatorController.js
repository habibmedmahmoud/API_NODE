// controllers/mediatorController.js

const Mediator = require("../models/Mediator");
const asyncHandler = require("express-async-handler");

// إنشاء وسيط جديد
exports.createMediator = asyncHandler(async (req, res) => {
  const existing = await Mediator.findOne({ user: req.user.id });
  if (existing) {
    return res.status(400).json({ message: "You are already a mediator" });
  }

  const mediator = await Mediator.create({
    user: req.user.id,
    bio: req.body.bio,
  });

  res.status(201).json(mediator);
});

// جلب كل الوسطاء المتاحين
exports.getAvailableMediators = asyncHandler(async (req, res) => {
  const mediators = await Mediator.find({ isAvailable: true }).populate("user", "username");
  res.status(200).json(mediators);
});
// تقييم الوسيط
exports.rateMediator = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const { id } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const mediator = await Mediator.findById(id);
  if (!mediator) {
    return res.status(404).json({ message: "Mediator not found" });
  }

  // حساب المتوسط الجديد
  mediator.rating =
    (mediator.rating * mediator.numberOfRatings + rating) /
    (mediator.numberOfRatings + 1);

  mediator.numberOfRatings += 1;

  await mediator.save();

  res.status(200).json({ message: "Rating submitted", rating: mediator.rating });
});
