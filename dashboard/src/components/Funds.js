import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFunds = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3002/funds");
      console.log("📊 Funds fetched:", response.data);
      setFunds(response.data);
    } catch (error) {
      console.error("Error fetching funds:", error);
      if (error.response?.status === 404) {
        alert("❌ Funds endpoint not found. Please check if the backend server is running.");
      } else {
        alert("❌ Error fetching funds: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAddFunds = async () => {
    if (!addAmount || addAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:3002/funds/add", {
        amount: parseFloat(addAmount),
        method: "UPI"
      });
      
      alert(`✅ Successfully added ₹${addAmount}`);
      setAddAmount("");
      setShowAddFundsModal(false);
      fetchFunds(); // Refresh funds data
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("❌ Error adding funds: " + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!funds || !funds.availableCash) {
      alert("❌ Funds data not loaded. Please refresh the page.");
      return;
    }

    if (withdrawAmount > funds.availableCash) {
      alert(`❌ Insufficient funds. Available: ₹${funds.availableCash}`);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:3002/funds/withdraw", {
        amount: parseFloat(withdrawAmount),
        method: "UPI"
      });
      
      alert(`✅ Successfully withdrew ₹${withdrawAmount}`);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      fetchFunds(); // Refresh funds data
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("❌ Error withdrawing funds: " + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:3002/funds/create-account", {
        accountType: "commodity"
      });
      
      alert("✅ Commodity account created successfully!");
      fetchFunds(); // Refresh funds data
    } catch (error) {
      console.error("Error creating account:", error);
      alert("❌ Error creating account: " + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <h3 className="title">Funds</h3>
        <p>Loading funds...</p>
      </div>
    );
  }

  if (!funds) {
    return (
      <div className="loading">
        <h3 className="title">Funds</h3>
        <p>❌ Unable to load funds data. Please check if the backend server is running.</p>
        <button className="btn btn-blue" onClick={fetchFunds}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button 
          className="btn btn-green" 
          onClick={() => setShowAddFundsModal(true)}
        >
          Add funds
        </button>
        <button 
          className="btn btn-blue" 
          onClick={() => setShowWithdrawModal(true)}
        >
          Withdraw
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Funds</h3>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
              />
            </div>
            <div className="modal-buttons">
              <button 
                className="btn btn-green" 
                onClick={handleAddFunds}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Add Funds"}
              </button>
              <button 
                className="btn btn-grey" 
                onClick={() => {
                  setShowAddFundsModal(false);
                  setAddAmount("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Withdraw Funds</h3>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                max={funds?.availableCash}
              />
              <small>Available: ₹{funds?.availableCash?.toFixed(2)}</small>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn btn-blue" 
                onClick={handleWithdraw}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Withdraw"}
              </button>
              <button 
                className="btn btn-grey" 
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">₹{funds?.availableMargin?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">₹{funds?.usedMargin?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">₹{funds?.availableCash?.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{funds?.openingBalance?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>₹{funds?.payin?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Payout</p>
              <p>₹{funds?.payout?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>₹{funds?.span?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>₹{funds?.deliveryMargin?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>₹{funds?.exposure?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹{funds?.optionsPremium?.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>₹{funds?.collateralLiquidFunds?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>₹{funds?.collateralEquity?.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>₹{funds?.totalCollateral?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <button 
              className="btn btn-blue" 
              onClick={handleCreateAccount}
              disabled={isProcessing}
            >
              {isProcessing ? "Creating..." : "Open Account"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
