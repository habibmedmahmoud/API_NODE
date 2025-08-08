const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExchangeOffer",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediator: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Mediator",
  default: null,
},

  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "cancelled"],
    default: "pending",
  },
  confirmedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);
