import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      email: "john@example.com",
      phone: "555-0101",
      lastVisit: "2026-01-05",
      adherence: 92,
      status: "Stable"
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 38,
      email: "jane@example.com",
      phone: "555-0102",
      lastVisit: "2026-01-03",
      adherence: 78,
      status: "Needs Attention"
    },
    {
      id: 3,
      name: "Robert Wilson",
      age: 62,
      email: "robert@example.com",
      phone: "555-0103",
      lastVisit: "2026-01-08",
      adherence: 85,
      status: "Stable"
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      date: "2026-01-12",
      time: "10:00 AM",
      reason: "Regular checkup",
      notes: "Blood pressure slightly elevated"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      date: "2026-01-12",
      time: "2:30 PM",
      reason: "Follow-up consultation",
      notes: "Review medication effects"
    }
  ]);

  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return "#10b981";
    if (adherence >= 80) return "#3b82f6";
    return "#f59e0b";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Stable": return "#10b981";
      case "Needs Attention": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  return (
    <div className="doctorProfile-dashboard">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="doctorProfile-info">
          <span>👨‍⚕️ Dr. Rajesh Kumar</span>
          <Link to="/">Logout</Link>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${selectedTab === "overview" ? "active" : ""}`}
            onClick={() => setSelectedTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${selectedTab === "patients" ? "active" : ""}`}
            onClick={() => setSelectedTab("patients")}
          >
            👥 Patients
          </button>
          <button
            className={`tab-btn ${selectedTab === "appointments" ? "active" : ""}`}
            onClick={() => setSelectedTab("appointments")}
          >
            📅 Appointments
          </button>
          <button
            className={`tab-btn ${selectedTab === "reports" ? "active" : ""}`}
            onClick={() => setSelectedTab("reports")}
          >
            📋 Reports
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <section className="tab-content">
            <h2>Dashboard Overview</h2>
            
            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <h3>Total Patients</h3>
                <p className="stat-number">{patients.length}</p>
                <span className="stat-icon">👥</span>
              </div>
              <div className="stat-card secondary">
                <h3>Today's Appointments</h3>
                <p className="stat-number">{appointments.length}</p>
                <span className="stat-icon">📅</span>
              </div>
              <div className="stat-card tertiary">
                <h3>Average Adherence</h3>
                <p className="stat-number">85%</p>
                <span className="stat-icon">📈</span>
              </div>
              <div className="stat-card quaternary">
                <h3>Pending Reviews</h3>
                <p className="stat-number">2</p>
                <span className="stat-icon">⚠️</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <h3>Recent Patient Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">📝</span>
                  <div className="activity-details">
                    <p>John Doe's medication adherence reached 92%</p>
                    <small>2 hours ago</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">⚠️</span>
                  <div className="activity-details">
                    <p>Jane Smith has low adherence (78%)</p>
                    <small>4 hours ago</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">✓</span>
                  <div className="activity-details">
                    <p>Robert Wilson completed appointment</p>
                    <small>1 day ago</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Patients Tab */}
        {selectedTab === "patients" && (
          <section className="tab-content">
            <div className="patients-header">
              <h2>Patient Management</h2>
              <button className="add-patient-btn">+ Add New Patient</button>
            </div>

            <div className="patients-table-container">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Last Visit</th>
                    <th>Adherence</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id} className="patient-row">
                      <td><strong>{patient.name}</strong></td>
                      <td>{patient.age}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.lastVisit}</td>
                      <td>
                        <div className="adherence-bar">
                          <div
                            className="adherence-fill"
                            style={{
                              width: `${patient.adherence}%`,
                              backgroundColor: getAdherenceColor(patient.adherence)
                            }}
                          />
                          <span>{patient.adherence}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(patient.status),
                            color: "white"
                          }}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view-btn" onClick={() => setSelectedPatient(patient)}>View</button>
                        <button className="action-btn edit-btn">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Patient Details Modal */}
            {selectedPatient && (
              <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{selectedPatient.name} - Patient Profile</h2>
                    <button className="close-btn" onClick={() => setSelectedPatient(null)}>✕</button>
                  </div>
                  <div className="patient-details">
                    <div className="detail-section">
                      <h3>Basic Information</h3>
                      <p><strong>Age:</strong> {selectedPatient.age}</p>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                      <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                      <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
                    </div>
                    <div className="detail-section">
                      <h3>Health Status</h3>
                      <p><strong>Adherence:</strong> {selectedPatient.adherence}%</p>
                      <p><strong>Status:</strong> {selectedPatient.status}</p>
                      <p><strong>Overall Health:</strong> Good</p>
                    </div>
                    <div className="modal-actions">
                      <button className="action-primary">Schedule Appointment</button>
                      <button className="action-secondary">Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Appointments Tab */}
        {selectedTab === "appointments" && (
          <section className="tab-content">
            <h2>Today's Appointments</h2>
            <div className="appointments-list">
              {appointments.map(apt => (
                <div key={apt.id} className="appointment-item">
                  <div className="appointment-left">
                    <h3>{apt.patientName}</h3>
                    <p><strong>Time:</strong> {apt.time}</p>
                    <p><strong>Reason:</strong> {apt.reason}</p>
                  </div>
                  <div className="appointment-middle">
                    <p className="appointment-notes">{apt.notes}</p>
                  </div>
                  <div className="appointment-right">
                    <button className="apt-btn complete">Mark Complete</button>
                    <button className="apt-btn reschedule">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reports Tab */}
        {selectedTab === "reports" && (
          <section className="tab-content">
            <h2>Reports & Analytics</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>Patient Adherence Report</h3>
                <p>Track medication adherence trends across all patients</p>
                <button className="report-btn">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Appointment Summary</h3>
                <p>Monthly appointment statistics and analytics</p>
                <button className="report-btn">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Health Outcomes Report</h3>
                <p>Patient health metrics and treatment outcomes</p>
                <button className="report-btn">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Patient Management Report</h3>
                <p>Comprehensive overview of all patients and their status</p>
                <button className="report-btn">Generate Report</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;