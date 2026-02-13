import { useState, useEffect } from "react";
import api from "../../api";
import "../Doctor/DoctorProfile.css"; // Reuse Doctor Profile CSS

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    knownDisease: "",
    symptoms: "",
    allergies: "",
    note: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setProfile({
        age: response.data.age || "",
        gender: response.data.gender || "",
        bloodGroup: response.data.bloodGroup || "",
        knownDisease: response.data.knownDisease || "",
        symptoms: response.data.symptoms || "",
        allergies: response.data.allergies || "",
        note: response.data.note || ""
      });
    } catch (err) {
      console.log("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/user/profile", profile);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="doctor-profile-container">
      <div className="profile-card">
        <h2>My Medical Profile</h2>
        <p className="subtitle">Keep your health information up to date for better diagnosis.</p>

        {message && <div className={`status-banner ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

        <form onSubmit={handleSave} className="profile-form">
          
          {/* Photo upload moved to Sidebar */}

          <div className="form-grid">
            <div className="input-group">
              <label>Age</label>
              <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="e.g. 25" required />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Blood Group</label>
              <input type="text" name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
            </div>
            <div className="input-group">
              <label>Known Diseases</label>
              <input type="text" name="knownDisease" value={profile.knownDisease} onChange={handleChange} placeholder="e.g. Diabetes, Hypertension" />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Allergies</label>
            <input type="text" name="allergies" value={profile.allergies} onChange={handleChange} placeholder="e.g. Peanuts, Penicillin" />
          </div>

          <div className="input-group full-width">
            <label>Current Symptoms</label>
            <textarea name="symptoms" value={profile.symptoms} onChange={handleChange} placeholder="Describe what you are feeling..." />
          </div>

          <div className="input-group full-width">
            <label>Additional Note</label>
            <textarea name="note" value={profile.note} onChange={handleChange} placeholder="Any other information for the doctor..." />
          </div>

          <button type="submit" className="save-btn">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
