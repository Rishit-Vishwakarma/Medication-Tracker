import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VideoConsultation.css";

const VideoConsultation = () => {
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialization: "General Practitioner",
      date: "2026-01-15",
      time: "10:00 AM",
      status: "scheduled",
      notes: "Regular checkup",
      doctorImage: "👨‍⚕️",
      rating: 4.8
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialization: "Cardiologist",
      date: "2026-01-20",
      time: "2:30 PM",
      status: "completed",
      notes: "Heart assessment",
      doctorImage: "👨‍⚕️",
      rating: 4.9
    }
  ]);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [formData, setFormData] = useState({
    doctorName: "",
    specialization: "",
    date: "",
    time: "",
    notes: ""
  });

  const [availableDoctors] = useState([
    { id: 1, name: "Dr. Sarah Johnson", specialization: "General Practitioner", rating: 4.8 },
    { id: 2, name: "Dr. Michael Chen", specialization: "Cardiologist", rating: 4.9 },
    { id: 3, name: "Dr. Emily Watson", specialization: "Neurologist", rating: 4.7 },
    { id: 4, name: "Dr. James Rodriguez", specialization: "Dermatologist", rating: 4.6 }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScheduleConsultation = (e) => {
    e.preventDefault();
    const newConsultation = {
      id: Date.now(),
      ...formData,
      status: "scheduled",
      doctorImage: "👨‍⚕️",
      rating: 4.5
    };
    setConsultations([newConsultation, ...consultations]);
    setFormData({
      doctorName: "",
      specialization: "",
      date: "",
      time: "",
      notes: ""
    });
    setShowScheduleForm(false);
  };

  const handleStartConsultation = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleEndConsultation = () => {
    setSelectedConsultation(null);
  };

  const handleCancelConsultation = (id) => {
    setConsultations(consultations.filter(c => c.id !== id));
  };

  const getStatusColor = (status) => {
    return status === "scheduled" ? "#667eea" : status === "completed" ? "#10b981" : "#ef4444";
  };

  const upcomingConsultations = consultations.filter(c => c.status === "scheduled");
  const completedConsultations = consultations.filter(c => c.status === "completed");

  return (
    <div className="video-consultation">
      <header className="consultation-header">
        <h1>Video Consultation</h1>
        <Link to="/">Back to Home</Link>
      </header>

      <div className="consultation-content">
        {/* Active Consultation View */}
        {selectedConsultation && (
          <div className="video-session">
            <div className="video-overlay">
              <div className="video-container">
                <div className="video-frame">
                  <div className="placeholder-video">
                    <span className="doctorProfile-avatar">{selectedConsultation.doctorImage}</span>
                    <h3>{selectedConsultation.doctorName}</h3>
                    <p>{selectedConsultation.specialization}</p>
                  </div>
                </div>

                <div className="call-controls">
                  <button className="control-btn mute-btn" title="Mute">
                    🎤
                  </button>
                  <button className="control-btn video-btn" title="Toggle Video">
                    📹
                  </button>
                  <button className="control-btn screen-share-btn" title="Share Screen">
                    🖥️
                  </button>
                  <button className="control-btn end-call-btn" onClick={handleEndConsultation}>
                    📞 End Call
                  </button>
                </div>

                <div className="call-timer">
                  <p>Duration: <span id="timer">00:00</span></p>
                </div>

                <div className="chat-sidebar">
                  <h4>Chat with Doctor</h4>
                  <div className="chat-messages">
                    <div className="message doctorProfile">
                      <p>Hello! How are you feeling today?</p>
                    </div>
                    <div className="message patient">
                      <p>Good, thank you for asking.</p>
                    </div>
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Type a message..." />
                    <button>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Form */}
        {!selectedConsultation && (
          <>
            <div className="consultation-top">
              <button
                className="schedule-btn"
                onClick={() => setShowScheduleForm(!showScheduleForm)}
              >
                {showScheduleForm ? "✕ Cancel" : "+ Schedule Consultation"}
              </button>
            </div>

            {showScheduleForm && (
              <div className="schedule-form-container">
                <h2>Schedule a Video Consultation</h2>
                <form onSubmit={handleScheduleConsultation} className="schedule-form">
                  <label>
                    Select Doctor:
                    <select
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a doctorProfile...</option>
                      {availableDoctors.map(doctorProfile => (
                        <option key={doctorProfile.id} value={doctorProfile.name}>
                          {doctorProfile.name} - {doctorProfile.specialization}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="form-row">
                    <label>
                      Date:
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                    <label>
                      Time:
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>

                  <label>
                    Reason for Consultation:
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Describe your concern..."
                      rows="4"
                    />
                  </label>

                  <button type="submit" className="submit-btn">
                    Schedule Consultation
                  </button>
                </form>
              </div>
            )}

            {/* Upcoming Consultations */}
            <section className="consultations-section">
              <h2>Upcoming Consultations</h2>
              {upcomingConsultations.length === 0 ? (
                <p className="no-consultations">No upcoming consultations scheduled.</p>
              ) : (
                <div className="consultations-list">
                  {upcomingConsultations.map(consultation => (
                    <div key={consultation.id} className="consultation-card">
                      <div className="consultation-header">
                        <span className="doctorProfile-icon">{consultation.doctorImage}</span>
                        <div className="doctorProfile-info">
                          <h3>{consultation.doctorName}</h3>
                          <p>{consultation.specialization}</p>
                          <span className="rating">⭐ {consultation.rating}</span>
                        </div>
                      </div>

                      <div className="consultation-details">
                        <div className="detail">
                          <span className="label">📅 Date:</span>
                          <span>{consultation.date}</span>
                        </div>
                        <div className="detail">
                          <span className="label">⏰ Time:</span>
                          <span>{consultation.time}</span>
                        </div>
                        <div className="detail">
                          <span className="label">📝 Notes:</span>
                          <span>{consultation.notes}</span>
                        </div>
                      </div>

                      <div className="consultation-actions">
                        <button
                          className="start-btn"
                          onClick={() => handleStartConsultation(consultation)}
                        >
                          Start Video Call
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelConsultation(consultation.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Completed Consultations */}
            <section className="consultations-section">
              <h2>Consultation History</h2>
              {completedConsultations.length === 0 ? (
                <p className="no-consultations">No completed consultations yet.</p>
              ) : (
                <div className="consultations-list">
                  {completedConsultations.map(consultation => (
                    <div key={consultation.id} className="consultation-card completed">
                      <div className="consultation-header">
                        <span className="doctorProfile-icon">{consultation.doctorImage}</span>
                        <div className="doctorProfile-info">
                          <h3>{consultation.doctorName}</h3>
                          <p>{consultation.specialization}</p>
                          <span className="rating">⭐ {consultation.rating}</span>
                        </div>
                        <span className="status-badge completed-badge">✓ Completed</span>
                      </div>

                      <div className="consultation-details">
                        <div className="detail">
                          <span className="label">📅 Date:</span>
                          <span>{consultation.date}</span>
                        </div>
                        <div className="detail">
                          <span className="label">⏰ Time:</span>
                          <span>{consultation.time}</span>
                        </div>
                      </div>

                      <div className="consultation-actions">
                        <button className="view-notes-btn">View Notes</button>
                        <button className="rate-btn">Rate Consultation</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* How It Works */}
            <section className="how-it-works">
              <h2>How Video Consultation Works</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <span className="step-number">1</span>
                  <h3>Schedule</h3>
                  <p>Choose your doctorProfile and preferred time slot.</p>
                </div>
                <div className="step-card">
                  <span className="step-number">2</span>
                  <h3>Join Call</h3>
                  <p>Click "Start Video Call" at scheduled time.</p>
                </div>
                <div className="step-card">
                  <span className="step-number">3</span>
                  <h3>Consult</h3>
                  <p>Talk to your doctorProfile via secure video link.</p>
                </div>
                <div className="step-card">
                  <span className="step-number">4</span>
                  <h3>Follow-up</h3>
                  <p>Get prescription and notes after consultation.</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="features-section">
              <h2>Features</h2>
              <div className="features-grid">
                <div className="feature">
                  <span className="feature-icon">🎥</span>
                  <h3>High-Quality Video</h3>
                  <p>Crystal-clear video and audio for better diagnosis.</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">💬</span>
                  <h3>Live Chat</h3>
                  <p>Text-based communication during the call.</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <h3>Secure & Private</h3>
                  <p>Encrypted connection for confidentiality.</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">📋</span>
                  <h3>Instant Prescriptions</h3>
                  <p>Get e-prescriptions sent directly to your device.</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">💾</span>
                  <h3>Call Recording</h3>
                  <p>Records available for future reference (with consent).</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🏥</span>
                  <h3>Follow-ups</h3>
                  <p>Schedule follow-up consultations easily.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoConsultation;