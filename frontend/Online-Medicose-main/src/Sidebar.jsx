import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">💊</span>
          <h2>MediCose</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </Link>

        <Link
          to="/medications"
          className={`nav-item ${isActive("/medications") ? "active" : ""}`}
        >
          <span className="nav-icon">💊</span>
          <span className="nav-label">Medications</span>
        </Link>

        <Link
          to="/appointments"
          className={`nav-item ${isActive("/appointments") ? "active" : ""}`}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Appointments</span>
        </Link>

        <Link
          to="/profile"
          className={`nav-item ${isActive("/profile") ? "active" : ""}`}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </Link>

        <Link
          to="/health-analytics"
          className={`nav-item ${isActive("/health-analytics") ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Analytics</span>
        </Link>

        <Link
          to="/prescriptions"
          className={`nav-item ${isActive("/prescriptions") ? "active" : ""}`}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Prescriptions</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/login" className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span className="logout-label">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
