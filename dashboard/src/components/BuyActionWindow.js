import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

// Utility function to check holdings before selling
const checkHoldings = async (stockName) => {
  try {
    const response = await axios.get("http://localhost:3002/allHoldings");
    const holding = response.data.find(h => h.name === stockName);
    return holding;
  } catch (error) {
    console.error("Error checking holdings:", error);
    return null;
  }
};

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHolding, setCurrentHolding] = useState(null);

  // Check holdings when component mounts
  useEffect(() => {
    const fetchHolding = async () => {
      try {
        const response = await axios.get("http://localhost:3002/allHoldings");
        const holding = response.data.find(h => h.name === uid);
        setCurrentHolding(holding);
      } catch (error) {
        console.error("Error fetching holdings:", error);
      }
    };
    fetchHolding();
  }, [uid]);

  const handleBuyClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3002/newTrade", {
        name: uid,
        qty: parseInt(stockQuantity),
        price: parseFloat(stockPrice),
        mode: "BUY",
      });

      console.log("✅ Trade executed:", response.data);
      alert("✅ Buy order executed successfully!");
      
      // Trigger a page refresh or update holdings
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error executing trade:", error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
      alert("❌ Error executing buy order: " + errorMessage);
    } finally {
      setIsLoading(false);
      GeneralContext.closeBuyWindow();
    }
  };

  const handleSellClick = async () => {
    // Check if user has enough shares to sell
    if (currentHolding && stockQuantity > currentHolding.qty) {
      alert(`❌ Insufficient shares! You only have ${currentHolding.qty} shares of ${uid}, but trying to sell ${stockQuantity}.`);
      return;
    }

    if (!currentHolding) {
      alert(`❌ No holdings found for ${uid}. You cannot sell shares you don't own.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3002/newTrade", {
        name: uid,
        qty: parseInt(stockQuantity),
        price: parseFloat(stockPrice),
        mode: "SELL",
      });

      console.log("✅ Trade executed:", response.data);
      alert("✅ Sell order executed successfully!");
      
      // Trigger a page refresh or update holdings
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error executing trade:", error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
      alert("❌ Error executing sell order: " + errorMessage);
    } finally {
      setIsLoading(false);
      GeneralContext.closeBuyWindow();
    }
  };

  const handleCancelClick = () => {
    GeneralContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        {/* Show current holding info */}
        {currentHolding && (
          <div className="holding-info" style={{ 
            background: '#e8f5e8', 
            padding: '10px', 
            margin: '10px 0', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            <strong>Current Holding:</strong> {currentHolding.qty} shares @ ₹{currentHolding.avg.toFixed(2)} avg
          </div>
        )}
        
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              max={currentHolding ? currentHolding.qty : undefined}
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice * 0.1).toFixed(2)}</span>
        <div>
          <button 
            className="btn btn-blue" 
            onClick={handleBuyClick}
            disabled={isLoading || stockQuantity <= 0 || stockPrice <= 0}
          >
            {isLoading ? "Processing..." : "Buy"}
          </button>
          <button 
            className="btn btn-red" 
            onClick={handleSellClick}
            disabled={isLoading || stockQuantity <= 0 || stockPrice <= 0}
          >
            {isLoading ? "Processing..." : "Sell"}
          </button>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;