import { useState, useEffect } from "react";
import api from "../../api";
import "./Pharmacy.css";

export default function Pharmacy({ selectedMeds, clearSelection }) {
  const [prices, setPrices] = useState({});
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderDate] = useState(null);

  useEffect(() => {
    if (selectedMeds.length > 0) {
      fetchPrices();
    }
  }, [selectedMeds]);

  const fetchPrices = async () => {
    try {
      const response = await api.post("/pharmacy/prices", selectedMeds);
      setPrices(response.data);
    } catch (err) {
      console.error("Failed to fetch prices");
    }
  };

  const total = selectedMeds.reduce((sum, med) => sum + (prices[med] || 150), 0);

  const handlePlaceOrder = async () => {
    if (!address) return alert("Please enter delivery address");
    setLoading(true);
    try {
      const response = await api.post("/pharmacy/order", {
        medicines: selectedMeds,
        address: address,
        total: total
      });
      setOrderDate(response.data);
    } catch (err) {
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pharmacy-container success-view">
        <div className="success-card">
          <span className="success-icon">🚚</span>
          <h2>Order Placed Successfully!</h2>
          <p>Your medicines are on the way to: <strong>{orderPlaced.deliveryAddress}</strong></p>
          <p>Order ID: #{orderPlaced.id}</p>
          <button className="primary-btn" onClick={clearSelection}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pharmacy-container">
      <h2>Pharmacy Checkout</h2>
      <p className="subtitle">Confirm your medicines and delivery details</p>

      <div className="checkout-grid">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="med-items">
            {selectedMeds.map((med, i) => (
              <div key={i} className="med-price-row">
                <span>{med}</span>
                <span>₹{prices[med] || 150}.00</span>
              </div>
            ))}
          </div>
          <div className="total-row">
            <span>Total Amount</span>
            <span>₹{total}.00</span>
          </div>
        </div>

        <div className="delivery-form">
          <h3>Delivery Details</h3>
          <div className="input-group">
            <label>Home Delivery Address</label>
            <textarea 
              placeholder="Enter your full address..." 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="payment-info">
            <p>💳 Payment Method: <strong>Cash on Delivery</strong></p>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Processing..." : "Confirm & Place Order"}
          </button>
          <button className="cancel-btn" onClick={clearSelection}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
