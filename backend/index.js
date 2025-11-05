require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


const jwt = require("jsonwebtoken");



const JWT_SECRET = "zerodha_clone_secret_key";

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}


// Import models
const {HoldingsModel} = require("./model/HoldingsModel");
const {PositionsModel} = require("./model/PositionsModel");
const {OrdersModel} = require("./model/OrdersModel");
const {TradeModel} = require("./model/Trademodel");
const {FundsModel} = require("./model/FundsModel");
const { positions } = require("../dashboard/src/data/data");


const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/zerodha_trading";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Auto-seed database function
async function seedDatabase() {
  try {
    console.log("🌱 Checking database seeding...");
    
    // Check and seed funds
    let funds = await FundsModel.findOne({ userId: "default_user" });
    if (!funds) {
      console.log("📝 Creating default funds...");
      funds = new FundsModel({
        userId: "default_user",
        availableMargin: 10000.00,
        usedMargin: 0.00,
        availableCash: 10000.00,
        openingBalance: 10000.00,
        payin: 0.00,
        payout: 0.00,
        span: 0.00,
        deliveryMargin: 0.00,
        exposure: 0.00,
        optionsPremium: 0.00,
        collateralLiquidFunds: 0.00,
        collateralEquity: 0.00,
        totalCollateral: 0.00,
        lastUpdated: new Date()
      });
      await funds.save();
      console.log("✅ Default funds created");
    } else {
      console.log("✅ Funds already exist");
    }

    // Check and seed holdings
    const holdingsCount = await HoldingsModel.countDocuments();
    if (holdingsCount === 0) {
      console.log("📝 Creating sample holdings...");
      const sampleHoldings = [
        {
          name: "INFY",
          qty: 5,
          avg: 1350.50,
          price: 1555.45,
          net: "+15.18%",
          day: "-1.60%",
          isLoss: true
        },
        {
          name: "RELIANCE",
          qty: 2,
          avg: 2193.70,
          price: 2112.40,
          net: "-3.71%",
          day: "+1.44%",
          isLoss: false
        },
        {
          name: "TCS",
          qty: 3,
          avg: 3041.70,
          price: 3194.80,
          net: "+5.03%",
          day: "-0.25%",
          isLoss: true
        },
        {
          name: "HDFCBANK",
          qty: 4,
          avg: 1383.40,
          price: 1522.35,
          net: "+10.04%",
          day: "+0.11%",
          isLoss: false
        },
        {
          name: "WIPRO",
          qty: 2,
          avg: 489.30,
          price: 577.75,
          net: "+18.08%",
          day: "+0.32%",
          isLoss: false
        }
      ];
      await HoldingsModel.insertMany(sampleHoldings);
      console.log("✅ Sample holdings created");
    } else {
      console.log("✅ Holdings already exist");
    }

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully!");
    await seedDatabase();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Stop server if DB fails
  });

// Import routes
const tradeRoutes = require("./Routes/tradeRoutes");

// Routes
app.use("/trade", tradeRoutes);

app.get("/", (req, res) => {
  res.send("Zerodha Backend API is running...");
});

// Integrated Funds API endpoints
// Get current funds
app.get("/funds", async (req, res) => {
  try {
    let funds = await FundsModel.findOne({ userId: "default_user" });
    
    if (!funds) {
      // Create default funds if none exist
      funds = new FundsModel({
        userId: "default_user",
        availableMargin: 10000.00,
        availableCash: 10000.00,
        openingBalance: 10000.00
      });
      await funds.save();
    }
    
    res.json(funds);
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add funds
app.post("/funds/add", async (req, res) => {
  try {
    const { amount, method = "UPI" } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    
    let funds = await FundsModel.findOne({ userId: "default_user" });
    
    if (!funds) {
      funds = new FundsModel({ userId: "default_user" });
    }
    
    // Update funds
    funds.availableMargin += amount;
    funds.availableCash += amount;
    funds.payin += amount;
    funds.lastUpdated = new Date();
    
    await funds.save();
    
    console.log(`✅ Added ₹${amount} via ${method}`);
    
    res.json({
      message: `Successfully added ₹${amount} via ${method}`,
      funds
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ error: error.message });
  }
});

// Withdraw funds
app.post("/funds/withdraw", async (req, res) => {
  try {
    const { amount, method = "UPI" } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    
    let funds = await FundsModel.findOne({ userId: "default_user" });
    
    if (!funds) {
      return res.status(404).json({ error: "No funds account found" });
    }
    
    if (funds.availableCash < amount) {
      return res.status(400).json({ 
        error: `Insufficient funds. Available: ₹${funds.availableCash}` 
      });
    }
    
    // Update funds
    funds.availableMargin -= amount;
    funds.availableCash -= amount;
    funds.payout += amount;
    funds.lastUpdated = new Date();
    
    await funds.save();
    
    console.log(`✅ Withdrew ₹${amount} via ${method}`);
    
    res.json({
      message: `Successfully withdrew ₹${amount} via ${method}`,
      funds
    });
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create account
app.post("/funds/create-account", async (req, res) => {
  try {
    const { accountType = "commodity" } = req.body;
    
    let funds = await FundsModel.findOne({ userId: "default_user" });
    
    if (!funds) {
      funds = new FundsModel({ userId: "default_user" });
    }
    
    // Add account type specific fields
    if (accountType === "commodity") {
      funds.commodityAccount = true;
      funds.commodityAccountCreated = new Date();
    }
    
    funds.lastUpdated = new Date();
    await funds.save();
    
    console.log(`✅ Created ${accountType} account`);
    
    res.json({
      message: `Successfully created ${accountType} account`,
      funds
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all positions
app.get("/allPositions", (req, res) => {
  res.json(positions);
});


// Create new trade (replaces newOrder)
app.post("/newTrade", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const newTrade = new TradeModel({ name, qty, price, mode });
    await newTrade.save();
    
    // Get updated holdings after trade processing
    const holdings = await HoldingsModel.find({});
    
    res.status(201).json({ 
      message: "Trade executed successfully!", 
      trade: newTrade, 
      holdings 
    });
  } catch (err) {
    console.error("Error executing trade:", err);
    res.status(500).json({ error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
