const mongoose = require("mongoose");

const FundsSchema = new mongoose.Schema({
  userId: { type: String, default: "default_user" },
  availableMargin: { type: Number, default: 10000.00 },
  usedMargin: { type: Number, default: 0.00 },
  availableCash: { type: Number, default: 10000.00 },
  openingBalance: { type: Number, default: 10000.00 },
  payin: { type: Number, default: 0.00 },
  payout: { type: Number, default: 0.00 },
  span: { type: Number, default: 0.00 },
  deliveryMargin: { type: Number, default: 0.00 },
  exposure: { type: Number, default: 0.00 },
  optionsPremium: { type: Number, default: 0.00 },
  collateralLiquidFunds: { type: Number, default: 0.00 },
  collateralEquity: { type: Number, default: 0.00 },
  totalCollateral: { type: Number, default: 0.00 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = { FundsSchema };
