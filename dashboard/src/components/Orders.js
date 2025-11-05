import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    name: "",
    qty: 1,
    price: 0,
    mode: "BUY"
  });

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3002/allOrders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    try {
      const response = await axios.post("http://localhost:3002/newTrade", newOrder);
      alert("✅ Order placed successfully!");
      setShowNewOrderModal(false);
      setNewOrder({ name: "", qty: 1, price: 0, mode: "BUY" });
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("❌ Error placing order: " + (error.response?.data?.error || error.message));
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <h3 className="title">Orders</h3>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className="orders-header">
        <h3 className="title">Orders ({orders.length})</h3>
        <button 
          className="btn btn-blue"
          onClick={() => setShowNewOrderModal(true)}
        >
          New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <button 
            className="btn btn-blue"
            onClick={() => setShowNewOrderModal(true)}
          >
            Place Your First Order
          </button>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>
                    <span className={`order-type ${order.mode.toLowerCase()}`}>
                      {order.mode}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{order.price.toFixed(2)}</td>
                  <td>
                    <span className="status completed">Completed</span>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Place New Order</h3>
            <div className="form-group">
              <label>Stock Symbol</label>
              <input
                type="text"
                value={newOrder.name}
                onChange={(e) => setNewOrder({...newOrder, name: e.target.value})}
                placeholder="e.g., INFY, RELIANCE"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={newOrder.qty}
                onChange={(e) => setNewOrder({...newOrder, qty: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={newOrder.price}
                onChange={(e) => setNewOrder({...newOrder, price: parseFloat(e.target.value)})}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Order Type</label>
              <select
                value={newOrder.mode}
                onChange={(e) => setNewOrder({...newOrder, mode: e.target.value})}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn btn-blue" 
                onClick={handleCreateOrder}
                disabled={!newOrder.name || newOrder.qty <= 0 || newOrder.price <= 0}
              >
                Place Order
              </button>
              <button 
                className="btn btn-grey" 
                onClick={() => setShowNewOrderModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
