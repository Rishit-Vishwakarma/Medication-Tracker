import { useState, useEffect } from "react";
import api from "../../api";
import "./Prescriptions.css";

export default function Prescriptions({ onBuyClick }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get("/prescriptions/my");
      setPrescriptions(response.data);
    } catch (err) {
      console.error("Failed to fetch prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-page">
      <div className="page-header">
        <h2>Medical Prescriptions</h2>
        <p className="subtitle">Your digital health records and medications</p>
      </div>

      <div className="presc-grid">
        {loading ? <div className="loading">Loading...</div> : prescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions found.</div>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} className="presc-card">
              <div className="presc-header">
                <div className="doc-info">
                  <span className="doc-icon">👨‍⚕️</span>
                  <div>
                    <span className="doctor-name">Dr. {p.doctor?.userName || "Specialist"}</span>
                    <span className="presc-date">{p.date || "Recent"}</span>
                  </div>
                </div>
                <div className="presc-id">ID: #{p.id}</div>
              </div>

              <div className="presc-body">
                <div className="info-section">
                  <label>Diagnosis</label>
                  <p className="diagnosis-text">{p.diagnoses}</p>
                </div>

                <div className="info-section">
                  <label>Medications</label>
                  <ul className="med-list">
                    {p.medicines.map((m, i) => (
                      <li key={i}>
                        <span className="med-bullet">💊</span>
                        <span className="med-name">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {p.note && (
                  <div className="info-section">
                    <label>Doctor's Note</label>
                    <p className="note-text">{p.note}</p>
                  </div>
                )}

                <div className="follow-up-box">
                  <span className="calendar-icon">📅</span>
                  <div>
                    <label>Next Appointment</label>
                    <p>{p.nextAppointmentDate || "Not scheduled"}</p>
                  </div>
                </div>
              </div>

              <div className="presc-footer">
                <button className="buy-btn" onClick={() => onBuyClick(p.medicines)}>
                  🛒 Order Medicines
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
