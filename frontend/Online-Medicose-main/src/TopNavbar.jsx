import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./TopNavbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Enhanced notifications with types
  const notifications = [
    { 
      id: 1, 
      message: "Time to take Paracetamol (1 tablet)", 
      time: "5 mins ago",
      type: "medication",
      urgent: true
    },
    { 
      id: 2, 
      message: "Appointment with Dr. Sharma tomorrow at 2:00 PM", 
      time: "1 hour ago",
      type: "appointment",
      urgent: false
    },
    { 
      id: 3, 
      message: "Your prescription for Amoxicillin is ready", 
      time: "2 hours ago",
      type: "prescription",
      urgent: false
    },
    {
      id: 4,
      message: "Missed dose: Vitamins (7:00 PM yesterday)",
      time: "1 day ago",
      type: "missed",
      urgent: true
    }
  ];

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '📅';
      case 'prescription': return '📋';
      case 'missed': return '⚠️';
      default: return '🔔';
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.urgent).length;

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        
        
      </div>

      <div className="navbar-right">
        {/* Notification Bell */}
        <div className="notification-container">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.urgent ? 'urgent' : ''}`}>
                    <div className="notif-icon">{getNotificationIcon(notif.type)}</div>
                    <div className="notif-content">
                      <p className="notif-message">{notif.message}</p>
                      <p className="notif-time">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-btn" onClick={() => navigate('/notifications')}>View All</button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="user-container">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-avatar">👤</span>
            <span className="user-name">{user?.name || "User"}</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <p className="user-email">{user?.email || "user@example.com"}</p>
                <p className="user-role">Role: {user?.role || "User"}</p>
              </div>
              <div className="user-menu-divider"></div>
              <button
                className="user-menu-item"
                onClick={() => {
                  navigate("/profile");
                  setShowUserMenu(false);
                }}
              >
                ⚙️ Settings
              </button>
              <button
                className="user-menu-item"
                onClick={toggleDarkMode}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <div className="user-menu-divider"></div>
              <button
                className="user-menu-item logout-btn"
                onClick={() => {
                  navigate("/login");
                  setShowUserMenu(false);
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
