import { useEffect, useState } from "react";
import api from "../../api";
import "./AppointmentHistory.css";

export default function AppointmentHistory({ initialFilter = "ALL" }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/my-doctor");
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Failed to fetch doctor appointments", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // FILTER LOGIC
  const filteredAppointments = appointments.filter(a => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return a.status === "PENDING";
    if (filter === "TODAY") {
        const today = new Date().toISOString().split('T')[0];
        return a.appointmentDate === today;
    }
    return true;
  });

  return (
    <div className="appointment-analytics">
      <div className="page-header">
        <h2>Patient Appointments</h2>
        <div className="filter-tabs">
            <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
            <button className={filter === "TODAY" ? "active" : ""} onClick={() => setFilter("TODAY")}>Today</button>
            <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        </div>
      </div>

      <div className="table-section">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No appointments found for this filter.</td></tr>
              ) : (
                filteredAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.user?.username || "Unknown Patient"}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.appointmentTime}</td>
                    <td>{a.reason}</td>
                    <td>
                      <span className={`status ${a.status?.toLowerCase() || 'pending'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "PENDING" && (
                        <div className="action-buttons">
                          <button onClick={() => updateStatus(a.id, "CONFIRMED")} className="icon-btn confirm" title="Confirm">✓</button>
                          <button onClick={() => updateStatus(a.id, "CANCELLED")} className="icon-btn cancel" title="Cancel">✕</button>
                        </div>
                      )}
                      {a.status === "CONFIRMED" && (
                        <button onClick={() => updateStatus(a.id, "COMPLETED")} className="view-btn">Mark Done</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
