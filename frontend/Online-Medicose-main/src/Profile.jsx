import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    medicalHistory: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    caretakers: [],
    prescriptions: [],
    reminderNotifications: true,
    emailUpdates: true,
    language: "en",
    theme: "light",
    twoFactorAuth: false,
    loginAlerts: false,
    feedbackRating: "",
    feedbackComments: "",
    adherenceRate: 85,
    currentStreak: 7,
    totalMedications: 5,
    lastLogin: new Date().toLocaleString()
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Load user profile data on component mount
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Function to load user-specific profile data
  const loadUserProfile = () => {
    try {
      const userProfiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
      const userProfile = userProfiles[user.email] || getDefaultProfileData();
      setProfileData(userProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfileData(getDefaultProfileData());
    }
  };

  // Function to save user-specific profile data
  const saveUserProfile = (data) => {
    try {
      const userProfiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
      userProfiles[user.email] = {
        ...data,
        lastLogin: new Date().toLocaleString()
      };
      localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Get default profile data for new users
  const getDefaultProfileData = () => ({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "User",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    medicalHistory: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    caretakers: [],
    prescriptions: [],
    reminderNotifications: true,
    emailUpdates: true,
    language: "en",
    theme: "light",
    twoFactorAuth: false,
    loginAlerts: false,
    feedbackRating: "",
    feedbackComments: "",
    adherenceRate: Math.floor(Math.random() * 40) + 60, // Random 60-100%
    currentStreak: Math.floor(Math.random() * 20) + 1, // Random 1-20 days
    totalMedications: Math.floor(Math.random() * 8) + 1, // Random 1-8 medications
    lastLogin: new Date().toLocaleString()
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({ ...profileData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const addItem = (field, value) => {
    if (value && value.trim()) {
      setProfileData({
        ...profileData,
        [field]: [...profileData[field], value.trim()]
      });
    }
  };

  const removeItem = (field, index) => {
    setProfileData({
      ...profileData,
      [field]: profileData[field].filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

    if (!profileData.name.trim()) newErrors.name = "Name is required.";
    if (!profileData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!profileData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(profileData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (profileData.age && (isNaN(profileData.age) || profileData.age < 0 || profileData.age > 150)) {
      newErrors.age = "Please enter a valid age.";
    }
    if (profileData.newPassword && profileData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }
    if (profileData.newPassword !== profileData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (profileData.caretakerEmail && !emailRegex.test(profileData.caretakerEmail)) {
      newErrors.caretakerEmail = "Please enter a valid caretaker email.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reset to original data
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      // Save profile data to localStorage for the current user
      saveUserProfile(profileData);
      console.log("Profile saved for user:", user.email, profileData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({ general: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const addCaretaker = () => {
    if (profileData.caretakerName && profileData.caretakerEmail) {
      const newCaretaker = {
        name: profileData.caretakerName,
        email: profileData.caretakerEmail,
        phone: profileData.caretakerPhone
      };
      setProfileData({
        ...profileData,
        caretakers: [...profileData.caretakers, newCaretaker],
        caretakerName: "",
        caretakerEmail: "",
        caretakerPhone: ""
      });
    }
  };

  const removeCaretaker = (index) => {
    setProfileData({ ...profileData, caretakers: profileData.caretakers.filter((_, i) => i !== index) });
  };

  const addPrescription = () => {
    if (profileData.prescriptionFile) {
      const newPrescription = {
        name: profileData.prescriptionFile.name,
        url: URL.createObjectURL(profileData.prescriptionFile)
      };
      setProfileData({
        ...profileData,
        prescriptions: [...profileData.prescriptions, newPrescription],
        prescriptionFile: null
      });
    }
  };

  const removePrescription = (index) => {
    setProfileData({ ...profileData, prescriptions: profileData.prescriptions.filter((_, i) => i !== index) });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // In a real app, submit feedback to backend
    console.log("Feedback submitted:", profileData.feedbackRating, profileData.feedbackComments);
    alert("Thank you for your feedback!");
    setProfileData({ ...profileData, feedbackRating: "", feedbackComments: "" });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopNavbar />

      <main className="dashboard-main">
        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="profile-header-gradient">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profileData.profilePhoto ? (
                  <img src={URL.createObjectURL(profileData.profilePhoto)} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    <span>{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}</span>
                  </div>
                )}
                {isEditing && (
                  <label className="avatar-upload-btn">
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span>📷</span>
                  </label>
                )}
              </div>
              <div className="profile-header-info">
                <h1 className="profile-name">{profileData.name || "Your Name"}</h1>
                <p className="profile-role">{profileData.role}</p>
                <div className="profile-status">
                  <span className="status-indicator active"></span>
                  Active Member
                </div>
              </div>
            </div>
            <div className="profile-header-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button onClick={handleSave} className="btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
              ) : (
                <button onClick={handleEdit} className="btn-primary">Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content-grid">
          {/* Personal Details */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Details</h2>
              <span className="card-icon">👤</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={profileData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select name="bloodGroup" value={profileData.bloodGroup} onChange={handleChange}>
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{profileData.name || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{profileData.email || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{profileData.phone || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age</span>
                    <span className="info-value">{profileData.age || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{profileData.gender || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Blood Group</span>
                    <span className="info-value">{profileData.bloodGroup || "Not specified"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Emergency Contact</h2>
              <span className="card-icon">🚨</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={profileData.emergencyName}
                      onChange={handleChange}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      name="emergencyRelation"
                      value={profileData.emergencyRelation}
                      onChange={handleChange}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>
                </div>
              ) : (
                <div className="emergency-contact-display">
                  {profileData.emergencyName ? (
                    <>
                      <div className="emergency-contact-item">
                        <span className="contact-name">{profileData.emergencyName}</span>
                        <span className="contact-relation">{profileData.emergencyRelation}</span>
                      </div>
                      <div className="emergency-contact-item">
                        <span className="contact-phone">{profileData.emergencyPhone}</span>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📞</span>
                      <p>No emergency contact added</p>
                      <small>Add emergency contact information for safety</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Health Information */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Health Information</h2>
              <span className="card-icon">🏥</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Allergies</label>
                    <textarea
                      name="allergies"
                      value={profileData.allergies}
                      onChange={handleChange}
                      placeholder="List any allergies (e.g., penicillin, nuts, etc.)"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Chronic Conditions</label>
                    <textarea
                      name="chronicConditions"
                      value={profileData.chronicConditions}
                      onChange={handleChange}
                      placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Current Medications</label>
                    <textarea
                      name="currentMedications"
                      value={profileData.currentMedications}
                      onChange={handleChange}
                      placeholder="List current medications with dosages"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={profileData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Brief medical history and past conditions"
                      rows="3"
                    />
                  </div>
                </div>
              ) : (
                <div className="health-info-display">
                  <div className="health-chips">
                    {profileData.allergies && (
                      <div className="chip allergy-chip">
                        <span className="chip-icon">⚠️</span>
                        <span>Allergies: {profileData.allergies}</span>
                      </div>
                    )}
                    {profileData.chronicConditions && (
                      <div className="chip condition-chip">
                        <span className="chip-icon">💊</span>
                        <span>Conditions: {profileData.chronicConditions}</span>
                      </div>
                    )}
                    {profileData.currentMedications && (
                      <div className="chip medication-chip">
                        <span className="chip-icon">🩺</span>
                        <span>Medications: {profileData.currentMedications}</span>
                      </div>
                    )}
                  </div>
                  {(!profileData.allergies && !profileData.chronicConditions && !profileData.currentMedications) && (
                    <div className="empty-state">
                      <span className="empty-icon">📋</span>
                      <p>No health information added</p>
                      <small>Add your health details for better care</small>
                    </div>
                  )}
                  {profileData.medicalHistory && (
                    <div className="medical-history-section">
                      <h4>Medical History</h4>
                      <p>{profileData.medicalHistory}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity Insights */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Activity Insights</h2>
              <span className="card-icon">📊</span>
            </div>
            <div className="card-content">
              <div className="activity-metrics">
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">Medication Adherence</span>
                    <span className="metric-value">{profileData.adherenceRate}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${profileData.adherenceRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">Current Streak</span>
                    <span className="metric-value">{profileData.currentStreak} days</span>
                  </div>
                  <div className="streak-indicator">
                    <span className="streak-icon">🔥</span>
                    <span>Keep it up!</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">Total Medications</span>
                    <span className="metric-value">{profileData.totalMedications}</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">Last Login</span>
                    <span className="metric-value">{profileData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Preferences</h2>
              <span className="card-icon">⚙️</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="preferences-form">
                  <div className="preference-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        name="reminderNotifications"
                        checked={profileData.reminderNotifications}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch"></span>
                      <span className="toggle-text">Medication Reminders</span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        name="emailUpdates"
                        checked={profileData.emailUpdates}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch"></span>
                      <span className="toggle-text">Email Updates</span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <label className="select-label">
                      <span>Language</span>
                      <select name="language" value={profileData.language} onChange={handleChange}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </label>
                  </div>
                  <div className="preference-item">
                    <label className="select-label">
                      <span>Theme</span>
                      <select name="theme" value={profileData.theme} onChange={handleChange}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="preferences-display">
                  <div className="preference-status">
                    <span className={`status-badge ${profileData.reminderNotifications ? 'enabled' : 'disabled'}`}>
                      {profileData.reminderNotifications ? '✓' : '✗'} Medication Reminders
                    </span>
                    <span className={`status-badge ${profileData.emailUpdates ? 'enabled' : 'disabled'}`}>
                      {profileData.emailUpdates ? '✓' : '✗'} Email Updates
                    </span>
                  </div>
                  <div className="preference-info">
                    <div className="info-item">
                      <span className="info-label">Language</span>
                      <span className="info-value">{profileData.language === 'en' ? 'English' : profileData.language === 'es' ? 'Spanish' : profileData.language === 'fr' ? 'French' : 'German'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Theme</span>
                      <span className="info-value">{profileData.theme === 'light' ? 'Light' : profileData.theme === 'dark' ? 'Dark' : 'Auto'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Security & Privacy</h2>
              <span className="card-icon">🔒</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="security-form">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="security-toggles">
                    <div className="preference-item">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={profileData.twoFactorAuth}
                          onChange={handleChange}
                        />
                        <span className="toggle-switch"></span>
                        <span className="toggle-text">Two-Factor Authentication</span>
                      </label>
                    </div>
                    <div className="preference-item">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          name="loginNotifications"
                          checked={profileData.loginNotifications}
                          onChange={handleChange}
                        />
                        <span className="toggle-switch"></span>
                        <span className="toggle-text">Login Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="security-display">
                  <div className="security-status">
                    <span className={`status-badge ${profileData.twoFactorAuth ? 'enabled' : 'disabled'}`}>
                      {profileData.twoFactorAuth ? '🔐' : '🔓'} 2FA {profileData.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`status-badge ${profileData.loginNotifications ? 'enabled' : 'disabled'}`}>
                      {profileData.loginNotifications ? '🔔' : '🔕'} Login Alerts {profileData.loginNotifications ? 'On' : 'Off'}
                    </span>
                  </div>
                  <div className="security-tips">
                    <h4>Security Tips</h4>
                    <ul>
                      <li>Use a strong, unique password</li>
                      <li>Enable two-factor authentication</li>
                      <li>Monitor login activity</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caretakers */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Caretakers</h2>
              <span className="card-icon">👨‍⚕️</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="caretakers-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="caretakerName"
                        value={profileData.caretakerName}
                        onChange={handleChange}
                        placeholder="Caretaker's full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="caretakerEmail"
                        value={profileData.caretakerEmail}
                        onChange={handleChange}
                        placeholder="Caretaker's email address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="caretakerPhone"
                        value={profileData.caretakerPhone}
                        onChange={handleChange}
                        placeholder="Caretaker's phone number"
                      />
                    </div>
                    <div className="form-group">
                      <button onClick={addCaretaker} className="btn-secondary add-caretaker-btn">
                        Add Caretaker
                      </button>
                    </div>
                  </div>
                  <div className="caretakers-list">
                    {profileData.caretakers.map((caretaker, index) => (
                      <div key={index} className="caretaker-item">
                        <div className="caretaker-info">
                          <span className="caretaker-name">{caretaker.name}</span>
                          <span className="caretaker-contact">{caretaker.email} • {caretaker.phone}</span>
                        </div>
                        <button onClick={() => removeCaretaker(index)} className="btn-remove">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="caretakers-display">
                  {profileData.caretakers.length > 0 ? (
                    <div className="caretakers-list">
                      {profileData.caretakers.map((caretaker, index) => (
                        <div key={index} className="caretaker-item">
                          <div className="caretaker-avatar">
                            <span>{caretaker.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="caretaker-info">
                            <span className="caretaker-name">{caretaker.name}</span>
                            <span className="caretaker-contact">{caretaker.email}</span>
                            <span className="caretaker-contact">{caretaker.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">👥</span>
                      <p>No caretakers added</p>
                      <small>Add healthcare providers or family members</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Medical Documents</h2>
              <span className="card-icon">📄</span>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="documents-form">
                  <div className="form-group">
                    <label>Upload Document</label>
                    <input
                      type="file"
                      name="prescriptionFile"
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      onChange={handleChange}
                    />
                    <small>Supported formats: PDF, JPG, PNG, DOC, DOCX</small>
                  </div>
                  <button onClick={addPrescription} className="btn-secondary">
                    Upload Document
                  </button>
                  <div className="documents-list">
                    {profileData.prescriptions.map((prescription, index) => (
                      <div key={index} className="document-item">
                        <div className="document-info">
                          <span className="document-name">{prescription.name}</span>
                          <span className="document-type">Prescription</span>
                        </div>
                        <div className="document-actions">
                          <a href={prescription.url} target="_blank" rel="noopener noreferrer" className="btn-link">
                            View
                          </a>
                          <button onClick={() => removePrescription(index)} className="btn-remove">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="documents-display">
                  {profileData.prescriptions.length > 0 ? (
                    <div className="documents-list">
                      {profileData.prescriptions.map((prescription, index) => (
                        <div key={index} className="document-item">
                          <div className="document-icon">📄</div>
                          <div className="document-info">
                            <span className="document-name">{prescription.name}</span>
                            <span className="document-date">Uploaded recently</span>
                          </div>
                          <a href={prescription.url} target="_blank" rel="noopener noreferrer" className="btn-link">
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📂</span>
                      <p>No documents uploaded</p>
                      <small>Upload prescriptions, test results, and medical records</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="profile-card full-width">
            <div className="card-header">
              <h2>Share Your Feedback</h2>
              <span className="card-icon">💬</span>
            </div>
            <div className="card-content">
              <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Overall Rating</label>
                    <select name="rating" value={profileData.feedbackRating} onChange={handleChange}>
                      <option value="">Select rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Your Feedback</label>
                    <textarea
                      name="feedbackComments"
                      value={profileData.feedbackComments}
                      onChange={handleChange}
                      placeholder="Tell us about your experience, suggestions for improvement, or any issues you've encountered..."
                      rows="4"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="message-banner success">
            <span className="message-icon">✅</span>
            <span>{success}</span>
          </div>
        )}
        {errors.general && (
          <div className="message-banner error">
            <span className="message-icon">❌</span>
            <span>{errors.general}</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;