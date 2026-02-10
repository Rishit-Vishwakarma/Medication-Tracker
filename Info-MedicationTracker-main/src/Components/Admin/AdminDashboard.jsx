import { useState } from "react";
import "./AdminDashboard.css";

// Import Sub-Components
import AssignDoctor from "./AssignDoctor";
import ManageDoctors from "./ManageDoctors";
import Appointments from "./Appointments";
import Settings from "./Settings";
import AdminAnalytics from "./AdminAnalytics";
import ManageOrders from "./ManageOrders"; // ✅ NEW

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
          <button className={activeTab === "doctors" ? "active" : ""} onClick={() => setActiveTab("doctors")}>Manage Doctors</button>
          <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Appointments</button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Pharmacy Orders</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "assign" && <AssignDoctor />}
        {activeTab === "doctors" && <ManageDoctors />}
        {activeTab === "appointments" && <Appointments />}
        {activeTab === "orders" && <ManageOrders />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
}
