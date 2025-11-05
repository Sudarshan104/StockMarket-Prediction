const mongoose = require("mongoose");
const { HoldingsModel } = require("../model/HoldingsModel");

const TradeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, enum: ["BUY", "SELL"], required: true },
  date: { type: Date, default: Date.now }
});

// 🧠 POST SAVE MIDDLEWARE
TradeSchema.post("save", async function (doc, next) {
  console.log("✅ Middleware triggered for Trade:", doc); // Debug log
  const { name, qty, price, mode } = doc;

  let holding = await HoldingsModel.findOne({ name });

  if (mode === "BUY") {
    if (holding) {
      // Calculate new average price
      const totalCost = holding.avg * holding.qty + price * qty;
      const totalQty = holding.qty + qty;
      holding.avg = totalCost / totalQty;
      holding.qty = totalQty;
      holding.price = price; // Update current price
    } else {
      holding = new HoldingsModel({
        name,
        qty,
        avg: price,
        price: price,
        net: "0.00%",
        day: "0.00%",
        isLoss: false
      });
    }
    await holding.save();
    console.log("✅ BUY trade processed, holding updated:", holding);
  }

  if (mode === "SELL") {
    if (!holding) {
      console.log("❌ No holding found for SELL trade");
      // Throw an error to prevent the trade from being saved
      throw new Error(`No holdings found for ${name}. Cannot sell shares you don't own.`);
    }
    if (holding.qty < qty) {
      console.log("❌ Insufficient quantity for SELL trade");
      throw new Error(`Insufficient quantity. You only have ${holding.qty} shares of ${name}, but trying to sell ${qty}.`);
    }

    holding.qty -= qty;
    holding.price = price; // Update current price

    if (holding.qty === 0) {
      await HoldingsModel.deleteOne({ _id: holding._id });
      console.log("✅ SELL trade processed, holding deleted");
    } else {
      await holding.save();
      console.log("✅ SELL trade processed, holding updated:", holding);
    }
  }

  next();
});

module.exports = { TradeSchema };
