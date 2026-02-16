import { useState, useEffect } from "react";
import api from "../../api";
import "./Appointments.css";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'history'
  
  // Booking State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookMsg, setBookMsg] = useState("");
  const [booking, setBooking] = useState(false);

  // History State
  const [appointments, setAppointments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get("/appointments/my-patient");
      // Sort by ID Descending (Newest First)
      const sortedAppointments = response.data.sort((a, b) => b.id - a.id);
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true);
    setBookMsg("");

    try {
      const payload = {
        date: date,
        time: time + ":00",
        reason: reason
      };

      await api.post("/appointments/book", payload);
      setBookMsg("✅ Appointment booked successfully!");
      setDate("");
      setTime("");
      setReason("");
      // Switch to history tab after successful booking
      setTimeout(() => setActiveTab("history"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Booking failed. Ensure you have an assigned doctor.";
      setBookMsg("❌ " + errorMsg);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="patient-page">
      <div className="page-header">
        <h2>Appointments</h2>
        <p className="subtitle">Manage your doctor visits</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === "book" ? "active" : ""}`} 
          onClick={() => setActiveTab("book")}
        >
           Book New
        </button>
        <button 
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`} 
          onClick={() => setActiveTab("history")}
        >
           History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "book" && (
          <div className="book-card">
            <h3>Schedule a Visit</h3>
            <form onSubmit={handleBook}>
              <div className="input-group">
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Reason</label>
                <textarea 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  placeholder="Describe your symptoms..." 
                  required 
                />
              </div>
              <button type="submit" className="primary-btn" disabled={booking}>
                {booking ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
            {bookMsg && <p className={`status-msg ${bookMsg.includes('✅') ? 'success' : 'error'}`}>{bookMsg}</p>}
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-list">
            {loadingHistory ? <p>Loading...</p> : appointments.length === 0 ? (
              <p className="empty-state">No appointments found.</p>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="appt-card">
                  <div className="appt-header">
                    <span className="appt-date">{a.appointmentDate} at {a.appointmentTime}</span>
                    <span className={`appt-status ${a.status.toLowerCase()}`}>{a.status}</span>
                  </div>
                  <div className="appt-body">
                    <p><strong>Doctor:</strong> Dr. {a.doctor?.userName || "Assigned Doctor"}</p>
                    <p><strong>Reason:</strong> {a.reason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
