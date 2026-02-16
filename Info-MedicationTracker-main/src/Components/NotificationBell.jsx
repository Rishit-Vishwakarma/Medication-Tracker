import { useState, useEffect } from "react";
import api from "../api";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count")
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      try {
        await api.post("/notifications/mark-read");
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to mark as read");
      }
    }
  };

  return (
    <div className="notification-wrapper">
      <div className="bell-icon" onClick={handleBellClick}>
        🔔
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
          </div>
          <div className="dropdown-body">
            {notifications.length === 0 ? (
              <p className="empty-notif">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                  <p>{n.message}</p>
                  <span className="notif-time">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
