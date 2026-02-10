import { useState, useEffect } from "react";
import api from "../../api";
import "./ManageOrders.css";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/pharmacy/admin/all-orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>Pharmacy Orders</h2>
        <p>Monitor medicine orders and delivery status</p>
      </div>

      <div className="table-card">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient</th>
                <th>Medicines</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.user?.username || "Unknown"}</strong>
                  </td>
                  <td>{order.medicines.join(", ")}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
