import { useState, useEffect } from "react";
import api from "../../api";
import "./AssignDoctor.css";

export default function AssignDoctor() {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, docRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/doctors")
      ]);
      setUsers(userRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      console.error("Failed to fetch data");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post(`/admin/assign-doctor?userId=${selectedUser}&doctorId=${selectedDoctor}`);
      setMessage("✅ Doctor assigned successfully!");
      fetchData();
      setSelectedUser("");
      setSelectedDoctor("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Assignment failed"));
    }
  };

  const currentUser = users.find(u => u.id === parseInt(selectedUser));
  const currentDoctor = doctors.find(d => d.doctorId === parseInt(selectedDoctor));

  return (
    <div className="assign-container">
      <div className="page-header">
        <h2>Smart Doctor Assignment</h2>
        <p>Match patients with the right specialists based on symptoms.</p>
      </div>

      {message && <div className={`status-banner ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

      <div className="assign-grid">
        <div className="assign-card">
          <form onSubmit={handleAssign}>
            <div className="input-group">
              <label>Select Patient</label>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                <option value="">-- Choose Patient --</option>
                {/* SHOW ALL USERS - REMOVED FILTER */}
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username} {u.assignedDoctor ? `(Current: Dr. ${u.assignedDoctor})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Select Doctor</label>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.doctorId} value={d.doctorId}>{d.userName} - {d.specialization}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="primary-btn" disabled={!selectedUser || !selectedDoctor}>
              {currentUser?.assignedDoctor ? "Re-assign Doctor" : "Assign Specialist"}
            </button>
          </form>
        </div>

        <div className="matching-preview">
            <div className="preview-box">
                <h3>Patient Context</h3>
                {currentUser ? (
                    <div className="context-details">
                        <p><strong>Symptoms:</strong> <span className="highlight-text">{currentUser.symptoms}</span></p>
                        <p><strong>Known Diseases:</strong> {currentUser.knownDisease}</p>
                    </div>
                ) : <p className="placeholder-text">Select a patient to see symptoms</p>}
            </div>

            <div className="preview-box">
                <h3>Doctor Expertise</h3>
                {currentDoctor ? (
                    <div className="context-details">
                        <p><strong>Specialization:</strong> <span className="highlight-text">{currentDoctor.specialization}</span></p>
                        <p><strong>Degree:</strong> {currentDoctor.degreeName}</p>
                    </div>
                ) : <p className="placeholder-text">Select a doctor to see qualification</p>}
            </div>

            {currentUser && currentDoctor && (
                <div className="match-indicator">
                    <p>Matching <strong>{currentUser.username}</strong> with <strong>Dr. {currentDoctor.userName}</strong></p>
                </div>
            )}
        </div>
      </div>

      <div className="assignments-table-section">
        <h3>Current Assignments</h3>
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Symptoms</th>
                        <th>Assigned Doctor</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(u => u.assignedDoctor).map(u => (
                        <tr key={u.id}>
                            <td><strong>{u.username}</strong></td>
                            <td><span className="symptom-tag">{u.symptoms}</span></td>
                            <td>Dr. {u.assignedDoctor}</td>
                            <td>
                                <button className="remove-btn" onClick={async () => {
                                    await api.post(`/admin/remove-doctor?userId=${u.id}`);
                                    fetchData();
                                }}>Unassign</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
