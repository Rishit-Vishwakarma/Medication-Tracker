import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/dashboard", label: "🏠 Home" },
    { path: "/medications", label: "💊 Medicines" },
    { path: "/appointments", label: "📅 Appointments" },
    { path: "/notifications", label: "🔔 Notifications" },
    { path: "/health-analytics", label: "📊 Analytics" },
    { path: "/prescriptions", label: "📋 Prescriptions" },
    { path: "/video-consultation", label: "🎥 Consult" },
    { path: "/medication-refill", label: "🔄 Refill" },
  ];

  // Show doctor-specific menu if user is a doctor
  if (user?.role === "Doctor") {
    menuItems.push({ path: "/doctor-dashboard", label: "👨‍⚕️ My Dashboard" });
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>💊 Online Medicose</h1>
        </div>

        {/* Hamburger Menu */}
        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-link ${isActive(item.path)}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="header-actions">
          <Link to="/profile" className="profile-btn">
            👤 {user?.name || user?.email || "Profile"}
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
