const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  avg: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  net: { type: String, default: "0.00%" },
  day: { type: String, default: "0.00%" },
  isLoss: { type: Boolean, default: false }
});

module.exports = { HoldingsSchema };
