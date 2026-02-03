import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>Online Medicose</h1>
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/medications">Medicines</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/health-analytics">Analytics</Link>
          <Link to="/prescriptions">Prescriptions</Link>
          <Link to="/video-consultation">Consult</Link>
          <Link to="/medication-refill">Refill</Link>
          <Link to="/doctorProfile-dashboard">Doctor</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
        <Link to="/signup" className="cta-btn">Get Started</Link>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Never Miss Your Medicines Again</h2>
        <p>Smart reminders, tracking, and caregiver support for better health.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn primary">Sign Up</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="features">
        <h3>Key Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <span className="icon">⏰</span>
            <h4>Medicine Reminders</h4>
            <p>Get timely notifications for your doses.</p>
          </div>
          <div className="feature-card">
            <span className="icon">📊</span>
            <h4>Missed Dose Tracking</h4>
            <p>Track and analyze missed medications.</p>
          </div>
          <div className="feature-card">
            <span className="icon">👨‍⚕️</span>
            <h4>Caretaker Support</h4>
            <p>Allow caregivers to monitor intake.</p>
          </div>
          <div className="feature-card">
            <span className="icon">🤖</span>
            <h4>AI Medicine Q/A</h4>
            <p>Ask questions about your medicines.</p>
          </div>
          <div className="feature-card">
            <span className="icon">📅</span>
            <h4>Doctor Appointments</h4>
            <p>Schedule and manage appointments.</p>
          </div>
          <div className="feature-card">
            <span className="icon">🎤</span>
            <h4>Voice Assistance</h4>
            <p>Voice commands for ease of use.</p>
          </div>
        </div>
      </section>

      {/* Who Can Use */}
      <section className="users">
        <h3>Who Can Use This?</h3>
        <div className="users-grid">
          <div className="user-card">
            <span className="icon">👤</span>
            <h4>Patients</h4>
            <p>Take medicines on time with reminders.</p>
          </div>
          <div className="user-card">
            <span className="icon">👨‍👩‍👧</span>
            <h4>Caretakers</h4>
            <p>Monitor loved ones remotely.</p>
          </div>
          <div className="user-card">
            <span className="icon">🩺</span>
            <h4>Doctors</h4>
            <p>Manage prescriptions effectively.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <span className="step-icon">1</span>
            <p>Sign up and create your profile.</p>
          </div>
          <div className="step">
            <span className="step-icon">2</span>
            <p>Add medicines and set schedules.</p>
          </div>
          <div className="step">
            <span className="step-icon">3</span>
            <p>Get reminders and track intake.</p>
          </div>
          <div className="step">
            <span className="step-icon">4</span>
            <p>Improve health consistency.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <h3>Benefits</h3>
        <ul>
          <li>Reduces missed doses</li>
          <li>Helps elderly patients</li>
          <li>Supports remote care</li>
          <li>Easy and secure</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Start managing your medicines today</h3>
        <Link to="/signup" className="btn primary">Create Free Account</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Project</h4>
            <p>Online Medicose helps you stay on top of your medication schedule.</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@onlinemedicose.com</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <p>&copy; Online Medicose</p>
      </footer>
    </div>
  );
};

export default Home;