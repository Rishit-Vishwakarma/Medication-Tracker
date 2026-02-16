import { useState, useEffect } from "react";
import api from "../../api";
import "./DoctorProfile.css";

export default function DoctorProfile({ onUpdate }) {
  const [profile, setProfile] = useState({
    fullName: "",
    mobileNumber: "",
    degreeName: "",
    specialization: "",
    experienceYears: "",
    clinicAddress: "",
    bio: "",
    profilePhotoUrl: "",
    degreePhotoUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/doctor/profile");
      setProfile(response.data);
    } catch (err) {
      console.log("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, [field]: response.data }));
    } catch (err) {
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/doctor/profile", profile);
      setMessage("✅ Profile updated successfully!");
      if (onUpdate) onUpdate(); // ✅ Notify Dashboard to unlock sidebar
    } catch (err) {
      setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="doctor-profile-container">
      <div className="profile-card">
        <h2>Professional Profile</h2>
        <p className="subtitle">Complete your profile to build trust with your patients.</p>

        {message && <div className={`status-banner ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Dr. John Doe" required />
            </div>
            <div className="input-group">
              <label>Mobile Number</label>
              <input type="text" name="mobileNumber" value={profile.mobileNumber} onChange={handleChange} placeholder="+1 234 567 890" required />
            </div>
            <div className="input-group">
              <label>Degree Name</label>
              <input type="text" name="degreeName" value={profile.degreeName} onChange={handleChange} placeholder="MBBS, MD" required />
            </div>
            <div className="input-group">
              <label>Specialization</label>
              <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} placeholder="Cardiologist" required />
            </div>
            <div className="input-group">
              <label>Experience (Years)</label>
              <input type="number" name="experienceYears" value={profile.experienceYears} onChange={handleChange} placeholder="10" />
            </div>
            <div className="input-group">
              <label>Clinic Address</label>
              <input type="text" name="clinicAddress" value={profile.clinicAddress} onChange={handleChange} placeholder="123 Medical St, City" />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Short Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Tell patients about your expertise..." />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Profile Photo</label>
              <div className="file-input-wrapper">
                <input type="file" id="profilePhoto" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePhotoUrl')} hidden />
                <label htmlFor="profilePhoto" className="file-label">
                  {profile.profilePhotoUrl ? "✅ Photo Uploaded" : "📂 Choose Photo"}
                </label>
              </div>
            </div>
            <div className="input-group">
              <label>Degree Certificate</label>
              <div className="file-input-wrapper">
                <input type="file" id="degreePhoto" accept="image/*" onChange={(e) => handleFileUpload(e, 'degreePhotoUrl')} hidden />
                <label htmlFor="degreePhoto" className="file-label">
                  {profile.degreePhotoUrl ? "✅ Certificate Uploaded" : "📂 Choose Certificate"}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Save Professional Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
