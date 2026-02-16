import { useState } from "react";
import "./AdminDashboard.css";

// Import Sub-Components
import AssignDoctor from "./AssignDoctor";
import ManageDoctors from "./ManageDoctors"; // We will rename the content inside this
import Appointments from "./Appointments";
import Settings from "./Settings";
import AdminAnalytics from "./AdminAnalytics";
import ManageOrders from "./ManageOrders";

export default function AdminDashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="brand">MedicationTrack</h2>
        <div className="profile-section">
          <div className="avatar">🛡️</div>
          <h3>Admin Panel</h3>
          <p>{user.email}</p>
        </div>
        <nav className="menu">
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Analytics</button>
          <button className={activeTab === "assign" ? "active" : ""} onClick={() => setActiveTab("assign")}>Assign Doctor</button>
          
          {/* RENAMED TAB */}
          <button className={activeTab === "records" ? "active" : ""} onClick={() => setActiveTab("records")}>Medical Records</button>
          
          <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Appointments</button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Pharmacy Orders</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "assign" && <AssignDoctor />}
        
        {/* UPDATED COMPONENT CALL */}
        {activeTab === "records" && <ManageDoctors />} 

        {activeTab === "appointments" && <Appointments />}
        {activeTab === "orders" && <ManageOrders />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
}
