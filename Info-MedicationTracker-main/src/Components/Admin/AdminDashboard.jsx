import { useState } from "react";
import "./AdminDashboard.css";

// Import Sub-Components
import AssignDoctor from "./AssignDoctor";
import ManageDoctors from "./ManageDoctors";
import Appointments from "./Appointments";
import Settings from "./Settings";
import AdminAnalytics from "./AdminAnalytics";
import ManageOrders from "./ManageOrders";

export default function AdminDashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState("analytics");

  const getTitle = () => {
    switch(activeTab) {
      case "analytics": return "Platform Analytics";
      case "assign": return "Doctor Assignment";
      case "records": return "Medical Records Hub";
      case "appointments": return "Appointment Oversight";
      case "orders": return "Pharmacy Management";
      case "settings": return "System Settings";
      default: return "Admin Panel";
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="brand">Medicose</h2>
        <div className="profile-section">
          <div className="avatar">🛡️</div>
          <h3>Admin Panel</h3>
          <p>{user.email}</p>
        </div>
        <nav className="menu">
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Analytics</button>
          <button className={activeTab === "assign" ? "active" : ""} onClick={() => setActiveTab("assign")}>Assign Doctor</button>
          <button className={activeTab === "records" ? "active" : ""} onClick={() => setActiveTab("records")}>Medical Records</button>
          <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Appointments</button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Pharmacy Orders</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        {/* RESTORED TOPBAR */}
        <header className="admin-topbar">
            <div className="topbar-left">
                <h1>{getTitle()}</h1>
            </div>
            <div className="topbar-right">
                <div className="admin-account">
                    <span>{user.email}</span>
                    <div className="admin-avatar-small">🛡️</div>
                </div>
            </div>
        </header>

        <div className="admin-page-content">
            {activeTab === "analytics" && <AdminAnalytics />}
            {activeTab === "assign" && <AssignDoctor />}
            {activeTab === "records" && <ManageDoctors />} 
            {activeTab === "appointments" && <Appointments />}
            {activeTab === "orders" && <ManageOrders />}
            {activeTab === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
}
