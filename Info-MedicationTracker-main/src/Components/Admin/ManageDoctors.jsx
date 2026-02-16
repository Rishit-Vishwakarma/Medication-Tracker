import { useState, useEffect } from "react";
import api from "../../api";
import "./ManageDoctors.css";

export default function ManageDoctors() {
  const [activeSubTab, setActiveSubTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedPatient] = useState(null); // For Modal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/doctors")
      ]);
      setPatients(pRes.data);
      setDoctors(dRes.data);
    } catch (err) {
      console.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const viewPatientReports = async (patient) => {
      try {
          const res = await api.get(`/reports/user/${patient.id}`);
          setSelectedPatient({ ...patient, reports: res.data, type: 'patient' });
      } catch (err) {
          setSelectedPatient({ ...patient, reports: [], type: 'patient' });
      }
  };

  const viewDoctorDetails = async (doctor) => {
      try {
          const res = await api.get(`/doctor/profile-by-id/${doctor.doctorId}`);
          setSelectedPatient({ ...doctor, profile: res.data, type: 'doctor' });
      } catch (err) {
          setSelectedPatient({ ...doctor, profile: null, type: 'doctor' });
      }
  };

  return (
    <div className="records-container">
      <div className="page-header">
        <h2>Medical Records Hub</h2>
        <p>Oversee all patient health data and doctor credentials.</p>
      </div>

      <div className="sub-tabs">
        <button className={activeSubTab === "patients" ? "active" : ""} onClick={() => setActiveSubTab("patients")}>👥 Patients</button>
        <button className={activeSubTab === "doctors" ? "active" : ""} onClick={() => setActiveSubTab("doctors")}>👨‍⚕️ Doctors</button>
      </div>

      <div className="records-content">
        {loading ? <p>Loading records...</p> : (
          <div className="records-grid">
            {activeSubTab === "patients" ? (
              patients.map(p => (
                <div key={p.id} className="record-card-admin">
                  <div className="card-header">
                    <h4>{p.username}</h4>
                    <span className="email-tag">{p.email}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Symptoms:</strong> {p.symptoms}</p>
                    <p><strong>Doctor:</strong> {p.assignedDoctor || "Not Assigned"}</p>
                  </div>
                  <button className="view-details-btn" onClick={() => viewPatientReports(p)}>View Full Records</button>
                </div>
              ))
            ) : (
              doctors.map(d => (
                <div key={d.doctorId} className="record-card-admin">
                  <div className="card-header">
                    <h4>Dr. {d.userName}</h4>
                    <span className="special-tag">{d.specialization}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Degree:</strong> {d.degreeName}</p>
                    <p><strong>Email:</strong> {d.email}</p>
                  </div>
                  <button className="view-details-btn" onClick={() => viewDoctorDetails(d)}>View Credentials</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content-admin" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.type === 'patient' ? 'Patient Health Record' : 'Doctor Credentials'}</h3>
              <button className="close-btn" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedItem.type === 'patient' ? (
                <div className="patient-details-view">
                  <div className="detail-section">
                    <h4>Basic Info</h4>
                    <p><strong>Name:</strong> {selectedItem.username}</p>
                    <p><strong>Email:</strong> {selectedItem.email}</p>
                    <p><strong>Known Diseases:</strong> {selectedItem.knownDisease}</p>
                  </div>
                  <div className="detail-section">
                    <h4>Lab Reports</h4>
                    <div className="reports-list-admin">
                      {selectedItem.reports?.length === 0 ? <p>No reports uploaded.</p> : (
                        selectedItem.reports?.map(r => (
                          <a key={r.id} href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="report-item-admin">
                            📄 {r.reportName} ({r.reportDate})
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="doctor-details-view">
                  <div className="detail-section">
                    <h4>Professional Profile</h4>
                    <p><strong>Name:</strong> Dr. {selectedItem.userName}</p>
                    <p><strong>Specialization:</strong> {selectedItem.specialization}</p>
                    <p><strong>Degree:</strong> {selectedItem.degreeName}</p>
                    <p><strong>Experience:</strong> {selectedItem.profile?.experienceYears || "N/A"} Years</p>
                    <p><strong>Clinic:</strong> {selectedItem.profile?.clinicAddress || "N/A"}</p>
                  </div>
                  {selectedItem.profile?.degreePhotoUrl && (
                    <div className="detail-section">
                      <h4>Degree Certificate</h4>
                      <img src={selectedItem.profile.degreePhotoUrl} alt="Degree" className="degree-preview-admin" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
