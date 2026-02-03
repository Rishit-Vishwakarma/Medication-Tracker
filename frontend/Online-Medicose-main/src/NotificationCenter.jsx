import React, { useState } from "react";
import "./NotificationCenter.css";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Sarah Johnson is in 2 hours",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false
    },
    {
      id: 2,
      type: "medication",
      title: "Medication Reminder",
      message: "Time to take your Aspirin 500mg",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false
    },
    {
      id: 3,
      type: "health",
      title: "Health Update",
      message: "Your medication adherence is at 92% this week",
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true
    },
    {
      id: 4,
      type: "prescription",
      title: "Prescription Ready",
      message: "Your prescription for antibiotics is ready for pickup",
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true
    }
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    return notifications.filter(notif => notif.type === filter);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment": return "📅";
      case "medication": return "💊";
      case "health": return "❤️";
      case "prescription": return "📋";
      default: return "🔔";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setShowPanel(!showPanel)}
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showPanel && (
        <div className="notification-panel">
          <div className="notification-header">
            <h2>Notifications</h2>
            <div className="notification-controls">
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
              <button className="close-btn" onClick={() => setShowPanel(false)}>
                ✕
              </button>
            </div>
          </div>

          <div className="notification-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "appointment" ? "active" : ""}`}
              onClick={() => setFilter("appointment")}
            >
              Appointments
            </button>
            <button
              className={`filter-btn ${filter === "medication" ? "active" : ""}`}
              onClick={() => setFilter("medication")}
            >
              Medications
            </button>
            <button
              className={`filter-btn ${filter === "health" ? "active" : ""}`}
              onClick={() => setFilter("health")}
            >
              Health
            </button>
          </div>

          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <span className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </span>
                  <div className="notification-content">
                    <h3>{notif.title}</h3>
                    <p>{notif.message}</p>
                    <small>{formatTime(notif.timestamp)}</small>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;