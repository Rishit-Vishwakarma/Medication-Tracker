import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HealthAnalytics.css";

const HealthAnalytics = () => {
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

  // Sample data
  const adherenceData = {
    week: [85, 90, 88, 92, 87, 95, 91],
    month: [82, 85, 88, 91, 87, 90, 88, 85, 92, 89, 91, 90, 88, 85, 87, 90, 92, 88, 85, 90, 88, 91, 89, 85, 90, 88, 91, 92],
    year: [85, 87, 89, 88, 90, 92, 91, 88, 87, 89, 91, 90]
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthDays = Array.from({ length: 28 }, (_, i) => i + 1);
  const yearMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getLabels = () => {
    switch (timeRange) {
      case "week": return weekDays;
      case "month": return monthDays;
      case "year": return yearMonths;
      default: return weekDays;
    }
  };

  const getCurrentData = () => {
    return adherenceData[timeRange];
  };

  const maxValue = 100;
  const currentData = getCurrentData();
  const labels = getLabels();
  const avgAdherence = Math.round(currentData.reduce((a, b) => a + b, 0) / currentData.length);

  const getMedicationStats = () => [
    { name: "Aspirin 500mg", dosage: "2x daily", adherence: 95, color: "#10b981" },
    { name: "Metformin 1000mg", dosage: "2x daily", adherence: 88, color: "#3b82f6" },
    { name: "Lisinopril 10mg", dosage: "1x daily", adherence: 92, color: "#f59e0b" },
    { name: "Vitamin D3 2000IU", dosage: "1x daily", adherence: 78, color: "#8b5cf6" }
  ];

  const getHealthTrends = () => [
    { metric: "Blood Pressure", value: "120/80 mmHg", trend: "↓ Improving", color: "#10b981" },
    { metric: "Heart Rate", value: "72 bpm", trend: "→ Stable", color: "#3b82f6" },
    { metric: "Weight", value: "72 kg", trend: "↓ Improving", color: "#10b981" },
    { metric: "Blood Sugar", value: "105 mg/dL", trend: "↑ Needs attention", color: "#ef4444" }
  ];

  return (
    <div className="health-analytics">
      <header className="analytics-header">
        <h1>Health Analytics & Insights</h1>
        <Link to="/dashboard">Back to Home</Link>
      </header>

      <div className="analytics-content">
        {/* Medication Adherence Chart */}
        <section className="analytics-section">
          <div className="section-header">
            <h2>Medication Adherence</h2>
            <div className="time-selector">
              <button
                className={timeRange === "week" ? "active" : ""}
                onClick={() => setTimeRange("week")}
              >
                Week
              </button>
              <button
                className={timeRange === "month" ? "active" : ""}
                onClick={() => setTimeRange("month")}
              >
                Month
              </button>
              <button
                className={timeRange === "year" ? "active" : ""}
                onClick={() => setTimeRange("year")}
              >
                Year
              </button>
            </div>
          </div>

          <div className="chart-container">
            <div className="bar-chart">
              {currentData.map((value, index) => (
                <div key={index} className="bar-wrapper">
                  <div
                    className={`bar ${value >= 90 ? "excellent" : value >= 80 ? "good" : "fair"}`}
                    style={{ height: `${(value / maxValue) * 100}%` }}
                    title={`${value}%`}
                  />
                  <span className="bar-label">{labels[index]}</span>
                </div>
              ))}
            </div>
            <div className="chart-stats">
              <div className="stat">
                <h3>Average Adherence</h3>
                <p className="stat-value">{avgAdherence}%</p>
              </div>
              <div className="stat">
                <h3>Highest Day</h3>
                <p className="stat-value">{Math.max(...currentData)}%</p>
              </div>
              <div className="stat">
                <h3>Lowest Day</h3>
                <p className="stat-value">{Math.min(...currentData)}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Medication Performance */}
        <section className="analytics-section">
          <h2>Medication Performance</h2>
          <div className="medications-grid">
            {getMedicationStats().map((med, index) => (
              <div key={index} className="medication-card">
                <div className="med-header">
                  <h3>{med.name}</h3>
                  <span className="dosage">{med.dosage}</span>
                </div>
                <div className="med-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${med.adherence}%`,
                        backgroundColor: med.color
                      }}
                    />
                  </div>
                  <p className="adherence-percentage">{med.adherence}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Health Metrics */}
        <section className="analytics-section">
          <h2>Health Metrics Overview</h2>
          <div className="health-metrics">
            {getHealthTrends().map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-info">
                  <h3>{metric.metric}</h3>
                  <p className="metric-value">{metric.value}</p>
                  <p className={`metric-trend ${metric.trend.includes("↑") ? "up" : metric.trend.includes("↓") ? "down" : "stable"}`}>
                    {metric.trend}
                  </p>
                </div>
                <div
                  className="metric-indicator"
                  style={{ backgroundColor: metric.color }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Health Insights */}
        <section className="analytics-section">
          <h2>Health Insights</h2>
          <div className="insights-container">
            <div className="insight-card positive">
              <h3>✓ Great Job!</h3>
              <p>Your medication adherence has improved by 8% this month. Keep up the consistency!</p>
            </div>
            <div className="insight-card warning">
              <h3>⚠ Attention Needed</h3>
              <p>Your blood sugar levels have been slightly elevated. Consider reviewing your diet and activity.</p>
            </div>
            <div className="insight-card info">
              <h3>ℹ Tip</h3>
              <p>Setting reminders at the same time each day can boost your adherence by up to 25%.</p>
            </div>
            <div className="insight-card success">
              <h3>🎯 Milestone</h3>
              <p>You've maintained 85%+ adherence for 3 weeks! You're eligible for a health reward.</p>
            </div>
          </div>
        </section>

        {/* Statistics Summary */}
        <section className="analytics-section">
          <h2>Summary Statistics</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <h3>Total Medications</h3>
              <p>4</p>
            </div>
            <div className="stat-item">
              <h3>Doses Taken This Week</h3>
              <p>56 out of 58</p>
            </div>
            <div className="stat-item">
              <h3>Consecutive Days (On Track)</h3>
              <p>12 days</p>
            </div>
            <div className="stat-item">
              <h3>Completed Appointments</h3>
              <p>8</p>
            </div>
          </div>
        </section>

        {/* Export & Share */}
        <section className="analytics-section">
          <h2>Export & Share</h2>
          <div className="export-options">
            <button className="export-btn">📥 Export as PDF</button>
            <button className="export-btn">📧 Email Report</button>
            <button className="export-btn">👨‍⚕️ Share with Doctor</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthAnalytics;