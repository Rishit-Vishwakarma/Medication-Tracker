import { useState, useEffect } from "react";
import api from "../../api";
import "./Medication.css";

export default function Medication() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await api.get("/medication/today");
      setMedications(response.data);
    } catch (err) {
      console.error("Failed to fetch medications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await api.put(`/medication/${id}/toggle`);
      setMedications(medications.map(med => 
        med.id === id ? { ...med, taken: response.data.taken } : med
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const progress = totalCount === 0 ? 0 : (takenCount / totalCount) * 100;

  return (
    <div className="patient-page">
      {/* Headings Removed */}
      <div className="tracker-card">
        <div className="progress-section">
          <div className="progress-text">
            <span>Today's Progress</span>
            <span>{takenCount}/{totalCount} Taken</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="med-list">
          {loading ? <p>Loading...</p> : medications.length === 0 ? (
            <p className="no-meds">No medications prescribed for today.</p>
          ) : (
            medications.map((med) => (
              <div key={med.id} className={`med-item ${med.taken ? "taken" : ""}`} onClick={() => handleToggle(med.id)}>
                <div className="med-info">
                  <span className="med-icon">💊</span>
                  <span className="med-name">{med.medicineName}</span>
                </div>
                <div className="checkbox">
                  {med.taken && "✔"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
