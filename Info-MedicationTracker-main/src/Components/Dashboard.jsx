import { useState, useEffect } from "react";
import api from "../api";
import "./Dashboard.css";
import NotificationBell from "./NotificationBell";

// Import Sub-Components
import DoctorProfile from "./Doctor/DoctorProfile";
import AppointmentHistory from "./Doctor/AppointmentHistory";
import ContactUs from "./Doctor/ContactUs";

export default function Dashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patientReports, setPatientReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [apptFilter, setApptFilter] = useState("ALL");
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  });

  const [doctorName, setDoctorName] = useState(user.email.split('@')[0]);
  const [specialization, setSpecialization] = useState("Medical Specialist");
  const [photo, setPhoto] = useState("https://cdn-icons-png.flaticon.com/512/3774/3774299.png");

  const [prescription, setPrescription] = useState({ medicines: "", diagnoses: "", note: "", nextDate: "" });
  const [prescMsg, setPrescMsg] = useState("");

  useEffect(() => {
    checkProfile();
    if (isProfileComplete) {
        fetchPatients();
        fetchStats();
    }
    const interval = setInterval(() => {
        checkProfile();
        if (isProfileComplete) {
            if (activeTab === "patients") fetchPatients();
            fetchStats();
        }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, isProfileComplete]);

  const checkProfile = async () => {
    try {
      const res = await api.get("/doctor/profile");
      if (res.data.fullName) setDoctorName(res.data.fullName);
      if (res.data.specialization) setSpecialization(`${res.data.degreeName || ""} ${res.data.specialization}`);
      if (res.data.profilePhotoUrl) setPhoto(res.data.profilePhotoUrl);

      // STRICT CHECK: Must have Full Name and Specialization
      if (res.data.fullName && res.data.specialization) {
          setIsProfileComplete(true);
      } else {
          setIsProfileComplete(false);
          setActiveTab("profile");
      }
    } catch (err) {
      setIsProfileComplete(false);
      setActiveTab("profile");
    }
  };

  const fetchStats = async () => {
    try {
        const res = await api.get("/doctor/stats");
        setStats(res.data);
    } catch (err) { console.error("Stats failed"); }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get("/doctor/myUsers");
      setPatients(response.data);
    } catch (err) { console.error("Failed to fetch patients"); }
  };

  const openPrescribeModal = async (patient) => {
    setSelectedPatient(patient);
    setSidebarOpen(false);
    try {
        const res = await api.get(`/reports/user/${patient.id}`);
        setPatientReports(res.data);
    } catch (err) { setPatientReports([]); }
  };

  const closePrescribeModal = () => {
    setSelectedPatient(null);
    setSidebarOpen(true);
    setShowReports(false);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescMsg("");
    try {
      const medsList = prescription.medicines.split(',').map(m => m.trim());
      await api.post("/prescriptions/write", {
        userId: selectedPatient.id,
        medicines: medsList,
        diagnosis: prescription.diagnoses,
        note: prescription.note,
        nextAppointmentDate: prescription.nextDate
      });
      setPrescMsg("✅ Prescription sent successfully!");
      setTimeout(() => {
          closePrescribeModal();
          setPrescMsg("");
          setPrescription({ medicines: "", diagnoses: "", note: "", nextDate: "" });
      }, 2000);
    } catch (err) { setPrescMsg("❌ Failed to send prescription."); }
  };

  const renderDashboard = () => (
    <div className="doctor-dashboard-summary">
      <div className="welcome-banner">
        <h2>Welcome back, Dr. {doctorName.split(' ')[0]}! 👋</h2>
        <p>Here is an overview of your practice today.</p>
      </div>

      <div className="stats-grid-doctor">
        <div className="stat-card-doctor" onClick={() => setActiveTab("patients")}>
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <label>Total Patients</label>
            <h3>{stats.totalPatients}</h3>
          </div>
        </div>
        <div className="stat-card-doctor" onClick={() => { setActiveTab("appointments"); setApptFilter("TODAY"); }}>
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <label>Today's Visits</label>
            <h3>{stats.todayAppointments}</h3>
          </div>
        </div>
        <div className="stat-card-doctor" onClick={() => { setActiveTab("appointments"); setApptFilter("PENDING"); }}>
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <label>Pending Requests</label>
            <h3>{stats.pendingAppointments}</h3>
          </div>
        </div>
        <div className="stat-card-doctor" onClick={() => { setActiveTab("appointments"); setApptFilter("ALL"); }}>
          <span className="stat-icon">📈</span>
          <div className="stat-info">
            <label>Total Consultations</label>
            <h3>{stats.totalAppointments}</h3>
          </div>
        </div>
      </div>

      <div className="quick-actions-doctor">
        <h3>Quick Actions</h3>
        <div className="action-btns">
          <button onClick={() => setActiveTab("patients")}>📝 Write Prescription</button>
          <button onClick={() => setActiveTab("profile")}>⚙️ Update Profile</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="doctor-dashboard-wrapper">
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
              {isProfileComplete ? (
                <>
                  <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
                  <button className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>👥 My Patients</button>
                  <button className={activeTab === "appointments" ? "active" : ""} onClick={() => { setActiveTab("appointments"); setApptFilter("ALL"); }}>📅 Appointments</button>
                  <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>👤 Profile</button>
                  <button className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>🎧 Support</button>
                </>
              ) : (
                <button className="active blink-profile" onClick={() => setActiveTab("profile")}>⚠️ Complete Profile</button>
              )}
            </nav>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </aside>
        )}

        <main className="main-content" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
          <header className="doctor-topbar">
              <div className="topbar-left">
                  {isProfileComplete && <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>}
              </div>
              <div className="topbar-right">
                  {isProfileComplete && <NotificationBell />}
                  <div className="doctor-account">
                      <span>Dr. {doctorName}</span>
                      <img src={photo} alt="Account" />
                  </div>
              </div>
          </header>

          <div className="dashboard-page-content">
              {!isProfileComplete && <div className="profile-alert-doctor">Please complete your professional profile to access patient data.</div>}
              
              {activeTab === "dashboard" && isProfileComplete && renderDashboard()}
              {activeTab === "patients" && isProfileComplete && (
                <div className="content-section">
                  <h2>Patient Management</h2>
                  <div className="patient-list-card">
                    {patients.length === 0 ? (
                      <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}><p>No patients assigned yet.</p></div>
                    ) : (
                      <table>
                        <thead><tr><th>Patient Name</th><th>Email</th><th>Gender</th><th>Age</th><th>Action</th></tr></thead>
                        <tbody>
                          {patients.map((p, index) => (
                            <tr key={index}>
                              <td><strong>{p.userName}</strong></td>
                              <td>{p.email}</td>
                              <td>{p.gender || "N/A"}</td>
                              <td>{p.age || "N/A"}</td>
                              <td><button className="view-btn" onClick={() => openPrescribeModal(p)}>Prescribe</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "appointments" && isProfileComplete && <AppointmentHistory initialFilter={apptFilter} />}
              {activeTab === "profile" && <DoctorProfile onUpdate={checkProfile} />} {/* ✅ Added callback */}
              {activeTab === "contact" && isProfileComplete && <ContactUs />}
          </div>
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
                  <img src={selectedPatient.profilePhotoUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="Patient" className="patient-modal-photo" key={selectedPatient.profilePhotoUrl} />
                  <div className="profile-info-grid">
                    <div className="info-item"><label>Name</label><p>{selectedPatient.userName}</p></div>
                    <div className="info-item"><label>Email</label><p>{selectedPatient.email}</p></div>
                    <div className="info-item"><label>Age / Gender</label><p>{selectedPatient.age || "N/A"} / {selectedPatient.gender || "N/A"}</p></div>
                    <div className="info-item"><label>Known Diseases</label><p>{selectedPatient.knownDisease || "None"}</p></div>
                    <div className="info-item"><label>Symptoms</label><p className="highlight">{selectedPatient.symptoms || "None reported"}</p></div>
                    <div className="info-item"><label>Allergies</label><p>{selectedPatient.allergies || "None"}</p></div>
                    <div className="info-item"><label>Patient Note</label><p className="note-box">{selectedPatient.note || "No additional notes"}</p></div>
                  </div>
                  <button className="view-reports-btn" onClick={() => setShowReports(!showReports)}>{showReports ? "Hide Reports" : "📄 View Lab Reports"}</button>
                  {showReports && (
                    <div className="reports-gallery">
                      {patientReports.length === 0 ? <p className="no-reports">No reports uploaded.</p> : (
                        patientReports.map(r => (
                          <div key={r.id} className="report-item">
                            <div className="report-details"><span className="report-name">{r.reportName}</span><span className="report-date">{r.reportDate}</span></div>
                            <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="report-view-link">View</a>
                          </div>
                        ))
                      )}
                    </div>
                  )}
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
    </div>
  );
}
