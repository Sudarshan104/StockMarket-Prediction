import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [funds, setFunds] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch funds and holdings data
      const [fundsResponse, holdingsResponse] = await Promise.all([
        axios.get("http://localhost:3002/funds"),
        axios.get("http://localhost:3002/allHoldings")
      ]);
      
      setFunds(fundsResponse.data);
      setHoldings(holdingsResponse.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate portfolio metrics
  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = holdings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPnL = currentValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : 0;

  if (isLoading) {
    return (
      <div className="loading">
        <h3 className="title">Dashboard</h3>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="username">
        <h6>Hi, Trader!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{(funds?.availableMargin / 1000).toFixed(1)}k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{(funds?.usedMargin || 0).toFixed(0)}</span>
            </p>
            <p>
              Opening balance <span>₹{(funds?.openingBalance / 1000).toFixed(1)}k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              ₹{(totalPnL / 1000).toFixed(1)}k <small>{totalPnL >= 0 ? "+" : ""}{totalPnLPercent}%</small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{(currentValue / 1000).toFixed(1)}k</span>
            </p>
            <p>
              Investment <span>₹{(totalInvestment / 1000).toFixed(1)}k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Quick Actions</p>
        </span>

        <div className="data">
          <div className="quick-actions">
            <button 
              className="btn btn-green"
              onClick={() => window.location.href = '/funds'}
            >
              Add Funds
            </button>
            <button 
              className="btn btn-blue"
              onClick={() => window.location.href = '/holdings'}
            >
              View Holdings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
