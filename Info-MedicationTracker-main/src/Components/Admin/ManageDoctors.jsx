import { useState, useEffect } from "react";
import api from "../../api";
import "./ManageDoctors.css";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDoctor, setExpandedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    // 🔄 AUTO-POLLING: Refresh list every 2 seconds
    const interval = setInterval(fetchDoctors, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/admin/doctors-with-patients");
      setDoctors(response.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (doctorId) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null);
    } else {
      setExpandedDoctor(doctorId);
    }
  };

  const handleRemovePatient = async (userId) => {
    if (!window.confirm("Are you sure you want to unassign this patient?")) return;
    try {
      await api.delete(`/admin/remove-doctor/${userId}`);
      fetchDoctors();
    } catch (err) {
      alert("Failed to remove patient.");
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>Manage Doctors</h2>
        <p>View doctors and their assigned patients</p>
      </div>
      
      <div className="doctors-list">
        {loading ? <p>Loading...</p> : doctors.map((doc) => (
          <div key={doc.doctorId} className={`doctor-card-admin ${expandedDoctor === doc.doctorId ? "expanded" : ""}`}>
            <div className="doctor-header-admin" onClick={() => toggleExpand(doc.doctorId)}>
              <div className="doc-info">
                <h3>👨‍⚕️ {doc.userName}</h3>
                <p>{doc.email}</p>
              </div>
              <div className="doc-stats">
                <span>{doc.users ? doc.users.length : 0} Patients</span>
                <span className="arrow">{expandedDoctor === doc.doctorId ? "▲" : "▼"}</span>
              </div>
            </div>

            {expandedDoctor === doc.doctorId && (
              <div className="patient-list-admin">
                {(!doc.users || doc.users.length === 0) ? (
                  <p className="no-patients">No patients assigned.</p>
                ) : (
                  <table className="patient-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>
                            <button className="remove-btn" onClick={() => handleRemovePatient(u.id)}>Unassign</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
