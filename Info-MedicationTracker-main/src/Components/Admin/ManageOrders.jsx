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

  const updateStatus = async (id, newStatus) => {
      if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this order?`)) return;
      try {
          await api.put(`/pharmacy/admin/order/${id}/status`, { status: newStatus });
          fetchOrders();
      } catch (err) {
          alert("Failed to update status");
      }
  };

  return (
    <div className="manage-container">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.patientName || (order.user && order.user.username) || "Patient User"}</strong>
                  </td>
                  <td>{order.medicines.join(", ")}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                      {/* ONLY CANCEL BUTTON FOR ADMIN MODERATION */}
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' ? (
                          <button className="cancel-btn" onClick={() => updateStatus(order.id, 'CANCELLED')}>Cancel Order</button>
                      ) : (
                          <span className="no-action">-</span>
                      )}
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
