import { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";
import NotificationBell from "./NotificationBell";

// patient pages
import Appointments from "./Patient/Appointments";
import Prescriptions from "./Patient/Prescriptions";
import Medication from "./Patient/Medication";
import YourDoctor from "./Patient/YourDoctor";
import MyProfile from "./Patient/MyProfile";
import Pharmacy from "./Patient/Pharmacy";
import TrackOrders from "./Patient/TrackOrders";
import MyReports from "./Patient/MyReports";

export default function PatientDashboard({ user, logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [photo, setPhoto] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  
  const [summary, setSummary] = useState({
    nextAppt: null,
    latestPresc: null,
    latestOrder: null,
    medsCount: 0
  });

  useEffect(() => {
    checkProfile();
    if (isProfileComplete && activePage === "dashboard") {
        fetchSummary();
    }
    const interval = setInterval(() => {
        checkProfile();
        if (isProfileComplete && activePage === "dashboard") fetchSummary();
    }, 5000);
    return () => clearInterval(interval);
  }, [activePage, isProfileComplete]);

  const checkProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      if (res.data.profilePhotoUrl) setPhoto(`${res.data.profilePhotoUrl}?t=${new Date().getTime()}`);
      
      if (!res.data.age || !res.data.gender) {
          setIsProfileComplete(false);
          setActivePage("profile");
      } else {
          setIsProfileComplete(true);
      }
    } catch (err) {
      setIsProfileComplete(false);
      setActiveTab("profile");
    }
  };

  const fetchSummary = async () => {
    try {
      const [appts, prescs, orders, meds] = await Promise.all([
        api.get("/appointments/my-patient"),
        api.get("/prescriptions/my"),
        api.get("/pharmacy/my-orders"),
        api.get("/medication/my")
      ]);

      setSummary({
        nextAppt: appts.data.find(a => a.status === 'CONFIRMED' || a.status === 'PENDING'),
        latestPresc: prescs.data[0],
        latestOrder: orders.data[0],
        medsCount: meds.data.length
      });
    } catch (err) { console.error("Summary fetch failed"); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadRes = await api.post("/files/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const currentProfileRes = await api.get("/user/profile");
      const { user, id, ...cleanProfile } = currentProfileRes.data;
      await api.post("/user/profile", { ...cleanProfile, profilePhotoUrl: uploadRes.data });
      setPhoto(`${uploadRes.data}?t=${new Date().getTime()}`);
    } catch (err) { alert("Upload failed"); }
  };

  const renderDashboard = () => (
    <div className="dashboard-summary">
      <div className="welcome-banner">
        <h2>Hello, {user?.username || "Patient"}! 👋</h2>
        <p>Here is what's happening with your health today.</p>
      </div>

      <div className="summary-grid">
        <div className="summary-card highlight" onClick={() => setActivePage("appointments")}>
          <div className="card-icon">📅</div>
          <div className="card-info">
            <label>Next Appointment</label>
            {summary.nextAppt ? (
              <p><strong>{summary.nextAppt.appointmentDate}</strong> at {summary.nextAppt.appointmentTime}</p>
            ) : <p>No upcoming visits</p>}
          </div>
        </div>

        <div className="summary-card" onClick={() => setActivePage("prescriptions")}>
          <div className="card-icon">🧾</div>
          <div className="card-info">
            <label>Latest Prescription</label>
            {summary.latestPresc ? (
              <p><strong>{summary.latestPresc.diagnoses}</strong> ({summary.latestPresc.medicines.length} meds)</p>
            ) : <p>No prescriptions yet</p>}
          </div>
        </div>

        <div className="summary-card" onClick={() => setActivePage("medication")}>
          <div className="card-icon">💊</div>
          <div className="card-info">
            <label>Active Medications</label>
            <h3>{summary.medsCount} Medicines</h3>
          </div>
        </div>

        <div className="summary-card" onClick={() => setActivePage("track")}>
          <div className="card-icon">🚚</div>
          <div className="card-info">
            <label>Latest Order</label>
            {summary.latestOrder ? (
              <p>Status: <strong>{summary.latestOrder.status}</strong></p>
            ) : <p>No active orders</p>}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-btns">
          <button onClick={() => setActivePage("appointments")}>➕ Book Appointment</button>
          <button onClick={() => setActivePage("reports")}>📄 Upload Report</button>
          <button onClick={() => setActivePage("profile")}>👤 Update Profile</button>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "profile": return <MyProfile user={user} />;
      case "doctor": return <YourDoctor />;
      case "appointments": return <Appointments />;
      case "prescriptions": return <Prescriptions onBuyClick={(meds) => { setSelectedMeds(meds); setActivePage("pharmacy"); }} />;
      case "medication": return <Medication />;
      case "reports": return <MyReports />;
      case "track": return <TrackOrders />;
      case "pharmacy": return <Pharmacy selectedMeds={selectedMeds} clearSelection={() => setActivePage("track")} />;
      default: return renderDashboard();
    }
  };

  return (
    <div className={`layout ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <h2 className="brand">MedicationTrack</h2>
        <div className="profile-box">
          <div className="avatar-wrapper">
            <img src={photo} alt="Profile" className="sidebar-avatar" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png"} />
            <label htmlFor="sidebar-photo-upload" className="camera-icon">📷</label>
            <input type="file" id="sidebar-photo-upload" accept="image/*" onChange={handlePhotoUpload} hidden />
          </div>
          {/* Sidebar shows Username */}
          <p className="username">{user?.username || "Patient"}</p>
        </div>
        
        <ul className="menu">
          {isProfileComplete ? (
            <>
              <li className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>Dashboard</li>
              <li className={activePage === "profile" ? "active" : ""} onClick={() => setActivePage("profile")}>My Profile</li>
              <li className={activePage === "doctor" ? "active" : ""} onClick={() => setActivePage("doctor")}>Your Doctor</li>
              <li className={activePage === "appointments" ? "active" : ""} onClick={() => setActivePage("appointments")}>Appointments</li>
              <li className={activePage === "prescriptions" ? "active" : ""} onClick={() => setActivePage("prescriptions")}>Prescriptions</li>
              <li className={activePage === "medication" ? "active" : ""} onClick={() => setActivePage("medication")}>Medication</li>
              <li className={activePage === "reports" ? "active" : ""} onClick={() => setActivePage("reports")}>My Reports</li>
              <li className={activePage === "track" ? "active" : ""} onClick={() => setActivePage("track")}>Track Orders</li>
            </>
          ) : (
            <>
              <li className="active blink-profile" onClick={() => setActivePage("profile")}>⚠️ Complete Profile</li>
            </>
          )}
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="header-left">
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
          </div>
          <div className="account">
            {isProfileComplete && <NotificationBell />}
            {/* Topbar shows Email */}
            <span>{user?.email}</span>
            <img src={photo} alt="Account" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png"} />
          </div>
        </header>
        <div className="page-content">
            {!isProfileComplete && <div className="profile-alert">Please complete your profile details (Age & Gender) to unlock all features.</div>}
            {renderPage()}
        </div>
      </main>
    </div>
  );
}
