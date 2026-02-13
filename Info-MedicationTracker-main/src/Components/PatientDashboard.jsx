import { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";

// patient pages
import BookAppointment from "./Patient/BookAppointment";
import MyAppointments from "./Patient/MyAppointments";
import Prescriptions from "./Patient/Prescriptions";
import Medication from "./Patient/Medication";
import YourDoctor from "./Patient/YourDoctor";
import MyProfile from "./Patient/MyProfile";
import Pharmacy from "./Patient/Pharmacy";
import TrackOrders from "./Patient/TrackOrders";

export default function PatientDashboard({ user, logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkProfile();
    const interval = setInterval(checkProfile, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      if (res.data.profilePhotoUrl) {
          setPhoto(`${res.data.profilePhotoUrl}?t=${new Date().getTime()}`);
      }
      
      if (!res.data.age || !res.data.gender) setIsProfileComplete(false);
      else setIsProfileComplete(true);
    } catch (err) {
      setIsProfileComplete(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload File
      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newPhotoUrl = uploadRes.data;

      // 2. Update Profile with new URL
      const currentProfileRes = await api.get("/user/profile");
      
      // Clean the object to avoid circular reference or ID issues
      const { user, id, ...cleanProfile } = currentProfileRes.data;
      const updatedProfile = { ...cleanProfile, profilePhotoUrl: newPhotoUrl };
      
      await api.post("/user/profile", updatedProfile);
      
      // 3. Update State
      setPhoto(`${newPhotoUrl}?t=${new Date().getTime()}`);
      alert("Profile photo updated!");

    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleBuyMedicines = (meds) => {
    setSelectedMeds(meds);
    setActivePage("pharmacy");
  };

  const handleImageError = (e) => {
    e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  };

  const renderPage = () => {
    switch (activePage) {
      case "profile": return <MyProfile user={user} />;
      case "book": return <BookAppointment />;
      case "appointments": return <MyAppointments />;
      case "prescriptions": return <Prescriptions onBuyClick={handleBuyMedicines} />;
      case "medication": return <Medication />;
      case "doctor": return <YourDoctor />;
      case "pharmacy": return <Pharmacy selectedMeds={selectedMeds} clearSelection={() => setActivePage("track")} />;
      case "track": return <TrackOrders />;
      default:
        return (
          <section className="dashboard-grid">
            <div className="card" onClick={() => setActivePage("profile")}>
              <span className="icon">👤</span><p>My Profile</p>
            </div>
            <div className="card" onClick={() => setActivePage("book")}>
              <span className="icon">📅</span><p>Book Appointment</p>
            </div>
            <div className="card" onClick={() => setActivePage("appointments")}>
              <span className="icon">⏱</span><p>My Appointments</p>
            </div>
            <div className="card" onClick={() => setActivePage("prescriptions")}>
              <span className="icon">🧾</span><p>Prescriptions</p>
            </div>
            <div className="card" onClick={() => setActivePage("medication")}>
              <span className="icon">💊</span><p>Medication</p>
            </div>
            <div className="card" onClick={() => setActivePage("doctor")}>
              <span className="icon">👨‍⚕️</span><p>Your Doctor</p>
            </div>
            <div className="card" onClick={() => setActivePage("track")}>
              <span className="icon">🚚</span><p>Track Orders</p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className={`layout ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <h2 className="brand">MedicationTrack</h2>

        <div className="profile-box">
          <div className="avatar-wrapper">
            <img 
              src={photo} 
              alt="Profile" 
              onError={handleImageError} 
              className="sidebar-avatar" 
            />
            <label htmlFor="sidebar-photo-upload" className="camera-icon">
              📷
            </label>
            <input 
              type="file" 
              id="sidebar-photo-upload" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              hidden 
              disabled={uploading}
            />
          </div>
          <p className="username">{user?.username || user?.email.split('@')[0]}</p>
          {uploading && <span className="uploading-text">Uploading...</span>}
        </div>

        <ul className="menu">
          <li className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>Dashboard</li>
          <li className={`${activePage === "profile" ? "active" : ""} ${!isProfileComplete ? "blink-profile" : ""}`} 
              onClick={() => setActivePage("profile")}>My Profile</li>
          <li className={activePage === "book" ? "active" : ""} onClick={() => setActivePage("book")}>Book Appointment</li>
          <li className={activePage === "appointments" ? "active" : ""} onClick={() => setActivePage("appointments")}>My Appointments</li>
          <li className={activePage === "prescriptions" ? "active" : ""} onClick={() => setActivePage("prescriptions")}>Prescriptions</li>
          <li className={activePage === "medication" ? "active" : ""} onClick={() => setActivePage("medication")}>Medication</li>
          <li className={activePage === "doctor" ? "active" : ""} onClick={() => setActivePage("doctor")}>Your Doctor</li>
          <li className={activePage === "track" ? "active" : ""} onClick={() => setActivePage("track")}>Track Orders</li>
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
            <span>{user?.username || user?.email}</span>
            <img src={photo} alt="Account" onError={handleImageError} />
          </div>
        </header>

        <div className="page-content">
            {renderPage()}
        </div>
      </main>
    </div>
  );
}
