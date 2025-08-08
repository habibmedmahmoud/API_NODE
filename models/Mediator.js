// models/Mediator.js

const mongoose = require("mongoose");

const mediatorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // الوسيط يجب أن يكون مستخدمًا في النظام
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mediator", mediatorSchema);
