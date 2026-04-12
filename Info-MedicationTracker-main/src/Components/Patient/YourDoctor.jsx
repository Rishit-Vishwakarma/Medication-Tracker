import { useState, useEffect } from "react";
import api from "../../api";
import "./YourDoctor.css";

export default function YourDoctor() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      const response = await api.get("/user/profile/my-doctor");
      setDoctor(response.data);
    } catch (err) {
      setError("No doctor assigned yet or profile incomplete.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Doctor Info...</div>;

  return (
    <div className="patient-page">
      {/* Headings Removed */}
      {error ? (
        <div className="error-card">
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <div className="doctor-info-card">
          <div className="doctor-header">
            <img src={doctor.profilePhotoUrl || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt="Doctor" />
            <div className="doctor-title">
              <h3>{doctor.fullName}</h3>
              <p className="spec">{doctor.specialization}</p>
              <p className="deg">{doctor.degreeName}</p>
            </div>
          </div>

          <div className="doctor-details-grid">
            <div className="detail-item">
              <label>Experience</label>
              <p>{doctor.experienceYears || "N/A"} Years</p>
            </div>
            <div className="detail-item">
              <label>Contact</label>
              <p>{doctor.mobileNumber}</p>
            </div>
            <div className="detail-item full">
              <label>Clinic Address</label>
              <p>{doctor.clinicAddress || "Not available"}</p>
            </div>
            <div className="detail-item full">
              <label>About Doctor</label>
              <p>{doctor.bio || "No bio available."}</p>
            </div>
          </div>

          {doctor.degreePhotoUrl && (
            <div className="degree-section">
              <label>Verified Credentials</label>
              <img src={doctor.degreePhotoUrl} alt="Degree" className="degree-img" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
