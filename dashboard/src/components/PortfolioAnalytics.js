import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const PortfolioAnalytics = () => {
  const [holdings, setHoldings] = useState([]);
  const [funds, setFunds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [holdingsResponse, fundsResponse] = await Promise.all([
        axios.get("http://localhost:3002/allHoldings"),
        axios.get("http://localhost:3002/funds")
      ]);
      setHoldings(holdingsResponse.data);
      setFunds(fundsResponse.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate analytics
  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = holdings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPnL = currentValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : 0;

  // Top performers
  const topPerformers = holdings
    .map(stock => ({
      ...stock,
      pnl: (stock.price * stock.qty) - (stock.avg * stock.qty),
      pnlPercent: ((stock.price - stock.avg) / stock.avg * 100)
    }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 5);

  // Sector allocation (mock data)
  const sectorAllocation = [
    { sector: "Technology", value: 35, color: "#4CAF50" },
    { sector: "Banking", value: 25, color: "#2196F3" },
    { sector: "Energy", value: 20, color: "#FF9800" },
    { sector: "Healthcare", value: 15, color: "#9C27B0" },
    { sector: "Others", value: 5, color: "#607D8B" }
  ];

  if (isLoading) {
    return (
      <div className="loading">
        <h3 className="title">Portfolio Analytics</h3>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Portfolio Analytics</h3>

      {/* Portfolio Overview */}
      <div className="analytics-section">
        <h4>Portfolio Overview</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <h5>Total Investment</h5>
            <h3>₹{(totalInvestment / 1000).toFixed(1)}k</h3>
          </div>
          <div className="metric-card">
            <h5>Current Value</h5>
            <h3>₹{(currentValue / 1000).toFixed(1)}k</h3>
          </div>
          <div className="metric-card">
            <h5>Total P&L</h5>
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              ₹{(totalPnL / 1000).toFixed(1)}k ({totalPnLPercent}%)
            </h3>
          </div>
          <div className="metric-card">
            <h5>Available Cash</h5>
            <h3>₹{((funds?.availableCash || 0) / 1000).toFixed(1)}k</h3>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="analytics-section">
        <h4>Top Performers</h4>
        <div className="performers-list">
          {topPerformers.map((stock, index) => (
            <div key={index} className="performer-item">
              <div className="performer-info">
                <h5>{stock.name}</h5>
                <p>{stock.qty} shares</p>
              </div>
              <div className="performer-pnl">
                <span className={stock.pnl >= 0 ? "profit" : "loss"}>
                  ₹{stock.pnl.toFixed(2)} ({stock.pnlPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Allocation */}
      <div className="analytics-section">
        <h4>Sector Allocation</h4>
        <div className="sector-chart">
          {sectorAllocation.map((sector, index) => (
            <div key={index} className="sector-item">
              <div className="sector-bar">
                <div 
                  className="sector-fill" 
                  style={{ 
                    width: `${sector.value}%`, 
                    backgroundColor: sector.color 
                  }}
                ></div>
              </div>
              <div className="sector-info">
                <span className="sector-name">{sector.sector}</span>
                <span className="sector-value">{sector.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="analytics-section">
        <h4>Portfolio Performance</h4>
        <div className="chart-container">
          <VerticalGraph 
            data={{
              labels: holdings.map(stock => stock.name),
              datasets: [{
                label: "Current Value",
                data: holdings.map(stock => stock.price * stock.qty),
                backgroundColor: holdings.map((_, index) => 
                  index % 2 === 0 ? "rgba(65, 132, 243, 0.5)" : "rgba(76, 175, 80, 0.5)"
                )
              }]
            }} 
          />
        </div>
      </div>
    </>
  );
};

export default PortfolioAnalytics;
