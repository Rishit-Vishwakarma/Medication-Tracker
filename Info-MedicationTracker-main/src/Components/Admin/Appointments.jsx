import { useState, useEffect } from "react";
import api from "../../api";
import "./Appointments.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/admin/appointments");
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>All Appointments</h2>
        <p>Monitor all patient-doctor consultations</p>
      </div>

      <div className="table-card">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.user?.username}</strong></td>
                  <td>Dr. {a.doctor?.userName}</td>
                  <td>{a.appointmentDate} at {a.appointmentTime}</td>
                  <td>{a.reason}</td>
                  <td>
                    <span className={`status-badge ${a.status?.toLowerCase()}`}>
                      {a.status}
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
