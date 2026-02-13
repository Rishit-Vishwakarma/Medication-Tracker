import { useState, useEffect } from "react";
import api from "../api";
import "./Dashboard.css";

// Import Sub-Components
import DoctorProfile from "./Doctor/DoctorProfile";
import AppointmentHistory from "./Doctor/AppointmentHistory";
import ContactUs from "./Doctor/ContactUs";

export default function Dashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Sidebar Info State
  const [doctorName, setDoctorName] = useState(user.email.split('@')[0]);
  const [specialization, setSpecialization] = useState("Medical Specialist");
  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
  );

  // Prescription Form State
  const [prescription, setPrescription] = useState({
    medicines: "",
    diagnoses: "",
    note: "",
    nextDate: ""
  });
  const [prescMsg, setPrescMsg] = useState("");

  useEffect(() => {
    checkProfile();
    fetchPatients();

    const interval = setInterval(() => {
        checkProfile();
        if (activeTab === "patients") fetchPatients();
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const openPrescribeModal = (patient) => {
    // Ensure we use the latest data for the selected patient from the state
    const latestData = patients.find(p => p.id === patient.id) || patient;
    setSelectedPatient(latestData);
    setSidebarOpen(false);
  };

  const closePrescribeModal = () => {
    setSelectedPatient(null);
    setSidebarOpen(true);
  };

  const checkProfile = async () => {
    try {
      const res = await api.get("/doctor/profile");
      if (res.data.fullName) setDoctorName(res.data.fullName);
      if (res.data.specialization) setSpecialization(`${res.data.degreeName || ""} ${res.data.specialization}`);
      if (res.data.profilePhotoUrl) setPhoto(res.data.profilePhotoUrl);

      if (!res.data.fullName || !res.data.specialization) setIsProfileComplete(false);
      else setIsProfileComplete(true);
    } catch (err) {
      setIsProfileComplete(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get("/doctor/myUsers");
      setPatients(response.data);
      
      // If modal is open, update the selected patient data in real-time
      if (selectedPatient) {
          const updated = response.data.find(p => p.id === selectedPatient.id);
          if (updated) {
              // Only update if data changed to avoid flicker, but always update photo URL if changed
              if (updated.profilePhotoUrl !== selectedPatient.profilePhotoUrl) {
                  setSelectedPatient(prev => ({ ...prev, profilePhotoUrl: updated.profilePhotoUrl }));
              }
          }
      }
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescMsg("");
    try {
      const medsList = prescription.medicines.split(',').map(m => m.trim());
      const requestBody = {
        userId: selectedPatient.id,
        medicines: medsList,
        diagnosis: prescription.diagnoses,
        note: prescription.note,
        nextAppointmentDate: prescription.nextDate
      };
      await api.post("/prescriptions/write", requestBody);
      setPrescMsg("✅ Prescription sent successfully!");
      setTimeout(() => {
          closePrescribeModal();
          setPrescMsg("");
          setPrescription({ medicines: "", diagnoses: "", note: "", nextDate: "" });
      }, 2000);
    } catch (err) {
      setPrescMsg("❌ Failed to send prescription.");
    }
  };

  // Helper to get photo URL with cache busting
  const getPatientPhoto = (url) => {
      if (!url) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
      return `${url}?t=${new Date().getTime()}`; // Force refresh
  };

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <aside className="sidebar">
          <h2 className="brand">MedicationTrack</h2>
          <div className="profile-box">
            <img src={photo} alt="Profile" className="sidebar-avatar" />
            <p className="username">Dr. {doctorName}</p>
            <p style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem'}}>{specialization}</p>
          </div>
          <nav className="menu">
            <button className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>👥 My Patients</button>
            <button className={`${activeTab === "profile" ? "active" : ""} ${!isProfileComplete ? "blink-profile" : ""}`} 
                    onClick={() => setActiveTab("profile")}>👤 Profile</button>
            <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>📅 Appointments</button>
            <button className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>🎧 Support</button>
          </nav>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </aside>
      )}

      <main className="main-content" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
        {activeTab === "patients" && (
          <div className="content-section">
            <h2>Patient Management</h2>
            <div className="patient-list-card">
              {patients.length === 0 ? (
                <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>
                  <p>No patients assigned to you yet.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, index) => (
                      <tr key={index}>
                        <td><strong>{p.userName}</strong></td>
                        <td>{p.email}</td>
                        <td>{p.gender || "N/A"}</td>
                        <td>{p.age || "N/A"}</td>
                        <td>
                          <button className="view-btn" onClick={() => openPrescribeModal(p)}>Prescribe</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === "appointments" && <AppointmentHistory />}
        {activeTab === "profile" && <DoctorProfile />}
        {activeTab === "contact" && <ContactUs />}
      </main>

      {selectedPatient && (
        <div className="modal-overlay" onClick={closePrescribeModal}>
          <div className="modal-content split-view" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Patient Consultation</h2>
              <button className="close-btn" onClick={closePrescribeModal}>✕</button>
            </div>
            <div className="modal-body-split">
              <div className="patient-profile-side">
                <h3>Patient Profile</h3>
                
                {/* PATIENT PHOTO WITH CACHE BUSTING */}
                <img 
                  src={getPatientPhoto(selectedPatient.profilePhotoUrl)} 
                  alt="Patient" 
                  className="patient-modal-photo"
                  key={selectedPatient.profilePhotoUrl} // Force re-render
                />

                <div className="profile-info-grid">
                  <div className="info-item"><label>Name</label><p>{selectedPatient.userName}</p></div>
                  <div className="info-item"><label>Email</label><p>{selectedPatient.email}</p></div>
                  <div className="info-item"><label>Age / Gender</label><p>{selectedPatient.age || "N/A"} / {selectedPatient.gender || "N/A"}</p></div>
                  
                  {/* ADDED KNOWN DISEASES BACK */}
                  <div className="info-item"><label>Known Diseases</label><p>{selectedPatient.knownDisease || "None"}</p></div>

                  <div className="info-item"><label>Symptoms</label><p className="highlight">{selectedPatient.symptoms || "None reported"}</p></div>
                  <div className="info-item"><label>Allergies</label><p>{selectedPatient.allergies || "None"}</p></div>
                  <div className="info-item"><label>Patient Note</label><p className="note-box">{selectedPatient.note || "No additional notes"}</p></div>
                </div>
              </div>
              <div className="prescription-form-side">
                <h3>Write Prescription</h3>
                <form onSubmit={handlePrescriptionSubmit} className="presc-form">
                  <div className="input-group"><label>Diagnosis</label><input type="text" value={prescription.diagnoses} onChange={e => setPrescription({...prescription, diagnoses: e.target.value})} required placeholder="e.g. Viral Fever" /></div>
                  <div className="input-group"><label>Medicines (comma separated)</label><textarea value={prescription.medicines} onChange={e => setPrescription({...prescription, medicines: e.target.value})} required placeholder="e.g. Paracetamol 500mg, Vitamin C" /></div>
                  <div className="input-group"><label>Doctor's Note</label><input type="text" value={prescription.note} onChange={e => setPrescription({...prescription, note: e.target.value})} placeholder="e.g. Drink plenty of water" /></div>
                  <div className="input-group"><label>Next Follow-up</label><input type="date" value={prescription.nextDate} onChange={e => setPrescription({...prescription, nextDate: e.target.value})} /></div>
                  <button type="submit" className="primary-btn">Send Prescription</button>
                </form>
                {prescMsg && <div className={`status-msg ${prescMsg.includes('✅') ? 'success' : 'error'}`}>{prescMsg}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
