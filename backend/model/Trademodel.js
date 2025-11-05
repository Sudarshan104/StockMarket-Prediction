const { model } = require("mongoose");
const { TradeSchema } = require("../schemas/tradeSchema");

const TradeModel = model("trade", TradeSchema);

module.exports = { TradeModel };
