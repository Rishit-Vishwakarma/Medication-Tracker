import { useState, useEffect } from "react";
import api from "../../api";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/analytics");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-container">
      <h2>Platform Analytics</h2>
      <p className="subtitle">Real-time overview of platform activity</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <label>Total Patients</label>
            <h3>{stats.totalPatients}</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">👨‍⚕️</span>
          <div className="stat-info">
            <label>Total Doctors</label>
            <h3>{stats.totalDoctors}</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <label>Appointments</label>
            <h3>{stats.totalAppointments}</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🛒</span>
          <div className="stat-info">
            <label>Pharmacy Orders</label>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
