const { TradeModel } = require("../model/Trademodel");
const { HoldingsModel } = require("../model/HoldingsModel");

const createTrade = async (req, res) => {
  try {
    console.log("📝 Creating trade:", req.body);
    const trade = await TradeModel.create(req.body);
    
    // Get updated holdings after trade processing
    const holdings = await HoldingsModel.find({});
    
    console.log("✅ Trade created successfully:", trade);
    console.log("📊 Updated holdings:", holdings);
    
    res.status(201).json({ 
      message: "Trade executed successfully!", 
      trade, 
      holdings 
    });
  } catch (error) {
    console.error("❌ Error creating trade:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTrade };
