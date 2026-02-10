import { useState, useEffect } from "react";
import api from "../../api";
import "./TrackOrders.css";

export default function TrackOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/pharmacy/my-orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-page">
      <h2>Track Your Orders</h2>
      <p className="subtitle">Real-time status of your medication delivery</p>

      <div className="orders-list">
        {loading ? <p>Loading...</p> : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders placed yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className={`order-status ${order.status.toLowerCase()}`}>{order.status}</div>
              </div>
              
              <div className="order-body">
                <div className="meds-summary">
                  <strong>Medicines:</strong> {order.medicines.join(", ")}
                </div>
                <div className="delivery-info">
                  <div className="info-row">
                    <span>📍 Delivery to:</span>
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div className="info-row highlight">
                    <span>🕒 Estimated Arrival:</span>
                    <span>{order.status === 'DELIVERED' ? 'Delivered' : order.estimatedTime}</span>
                  </div>
                </div>

                {order.status !== 'DELIVERED' && (
                  <div className="tracking-progress">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: order.status === 'PENDING' ? '30%' : order.status === 'SHIPPED' ? '70%' : '100%' }}></div>
                    </div>
                    <div className="progress-labels">
                      <span>Ordered</span>
                      <span>Shipped</span>
                      <span>Arriving</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="order-footer">
                <span>Total: ₹{order.totalAmount}.00</span>
                <span className="date">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
