import { useState } from "react";
import api from "../../api";
import "./BookAppointment.css";

export default function BookAppointment() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send JSON payload
      const payload = {
        date: date,
        time: time + ":00",
        reason: reason
      };

      await api.post("/appointments/book", payload);
      setMessage("✅ Appointment booked successfully with your assigned doctor!");
      setDate("");
      setTime("");
      setReason("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "No doctor assigned yet. Please contact Admin.";
      setMessage("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-page">
      <h2>Book Appointment</h2>
      <p className="subtitle">Schedule a visit with your assigned doctor</p>

      <div className="slot-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleBook}>
          <div className="input-group">
            <label>Appointment Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Appointment Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Reason for Visit</label>
            <textarea 
              placeholder="Briefly describe your symptoms" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="confirm-btn" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>

        {message && <p className="status-msg" style={{ marginTop: '20px', textAlign: 'center', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </div>
  );
}
