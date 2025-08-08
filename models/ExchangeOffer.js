// models/ExchangeOffer.js
const mongoose = require("mongoose");
const Joi = require("joi"); // تأكد من أنك استوردت Joi

const exchangeOfferSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromCurrency: {
      type: String,
      required: true,
    },
    toCurrency: {
      type: String,
      required: true,
    },
    fromAmount: {
      type: Number,
      required: true,
    },
    toAmount: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// هنا أنشئ النموذج وخزنه في متغير
const ExchangeOffer = mongoose.model("ExchangeOffer", exchangeOfferSchema);

function validateCreateExchangeOffer(obj) {
  const schema = Joi.object({
    fromCurrency: Joi.string().required(),
    toCurrency: Joi.string().required(),
    fromAmount: Joi.number().positive().required(),
    toAmount: Joi.number().positive().required(),
    rate: Joi.number().positive().required(),
    notes: Joi.string().allow("", null),
    expiresAt: Joi.date().greater("now").allow(null),
  });

  return schema.validate(obj, { abortEarly: false });
}

function validateUpdateExchangeOffer(obj) {
  const schema = Joi.object({
    status: Joi.string().valid("pending", "accepted", "cancelled", "completed").required(),
  });

  return schema.validate(obj, { abortEarly: false });
}

module.exports = {
  ExchangeOffer,
  validateCreateExchangeOffer,
  validateUpdateExchangeOffer
};
