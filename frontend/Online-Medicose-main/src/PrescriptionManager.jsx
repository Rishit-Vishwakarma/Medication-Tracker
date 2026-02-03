import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./PrescriptionManager.css";

// Common drug interactions database
const DRUG_INTERACTIONS = {
  "Aspirin": ["Warfarin", "Clopidogrel", "NSAIDs", "Methotrexate"],
  "Metformin": ["Contrast dye", "Alcohol", "Diuretics"],
  "Lisinopril": ["Potassium supplements", "NSAIDs", "Diuretics"],
  "Simvastatin": ["Antibiotics", "Antifungals", "Grapefruit juice"],
  "Warfarin": ["Aspirin", "NSAIDs", "Antibiotics"],
  "Atorvastatin": ["Gemfibrozil", "Protease inhibitors"],
  "Amoxicillin": ["Warfarin", "Methotrexate"],
  "Ibuprofen": ["Aspirin", "Warfarin", "ACE inhibitors"]
};

// OCR-like text extraction simulation
const simulateOCR = (imageName) => {
  const mockExtractions = {
    "prescription1": {
      medicineName: "Aspirin",
      strength: "500mg",
      dosage: "1 tablet, 2 times daily",
      doctorProfile: "Dr. Johnson",
      prescribedDate: "2026-01-05"
    },
    "prescription2": {
      medicineName: "Metformin",
      strength: "1000mg",
      dosage: "1 tablet, twice daily with food",
      doctorProfile: "Dr. Chen",
      prescribedDate: "2025-12-10"
    }
  };
  return mockExtractions[imageName] || null;
};

const PrescriptionManager = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medicineName: "Aspirin",
      strength: "500mg",
      dosage: "1 tablet, 2 times daily",
      duration: "30 days",
      prescribedDate: "2026-01-05",
      expiryDate: "2026-04-05",
      doctorProfile: "Dr. Sarah Johnson",
      notes: "After meals",
      status: "Active",
      image: null,
      interactions: [],
      refillCount: 2
    },
    {
      id: 2,
      medicineName: "Metformin",
      strength: "1000mg",
      dosage: "1 tablet, 2 times daily",
      duration: "60 days",
      prescribedDate: "2025-12-10",
      expiryDate: "2026-02-08",
      doctorProfile: "Dr. Michael Chen",
      notes: "With breakfast and dinner",
      status: "Active",
      image: null,
      interactions: ["Alcohol", "Contrast dye"],
      refillCount: 1
    }
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showInteractions, setShowInteractions] = useState(false);
  const [selectedForInteraction, setSelectedForInteraction] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    medicineName: "",
    strength: "",
    dosage: "",
    duration: "",
    prescribedDate: "",
    expiryDate: "",
    doctorProfile: "",
    notes: "",
    prescriptionImage: null
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData({ ...uploadData, prescriptionImage: file });
      triggerOCR(file);
    }
  };

  const triggerOCR = async (file) => {
    setOcrLoading(true);
    // Simulate OCR processing
    setTimeout(() => {
      const mockOCRData = simulateOCR(file.name.split('.')[0]);
      if (mockOCRData) {
        setUploadData(prev => ({
          ...prev,
          ...mockOCRData
        }));
      }
      setOcrLoading(false);
    }, 1500);
  };

  const checkDrugInteractions = (medicine) => {
    const interactions = DRUG_INTERACTIONS[medicine] || [];
    const matchingInteractions = prescriptions
      .filter(p => p.id !== selectedForInteraction?.id)
      .filter(p => interactions.includes(p.medicineName))
      .map(p => ({
        conflictingMedicine: p.medicineName,
        interactionType: "Potential interaction detected"
      }));
    return matchingInteractions;
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    const interactions = checkDrugInteractions(uploadData.medicineName);
    const newPrescription = {
      id: Date.now(),
      ...uploadData,
      status: "Active",
      interactions: interactions,
      refillCount: 0
    };
    setPrescriptions([newPrescription, ...prescriptions]);
    setUploadData({
      medicineName: "",
      strength: "",
      dosage: "",
      duration: "",
      prescribedDate: "",
      expiryDate: "",
      doctorProfile: "",
      notes: "",
      prescriptionImage: null
    });
    setShowUploadForm(false);
  };

  const handleDeletePrescription = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    setSelectedPrescription(null);
  };

  const handleRefillRequest = (id) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, refillCount: p.refillCount + 1 } : p
    ));
    alert("Refill request sent to your pharmacy!");
  };

  const handleSharePrescription = (prescription) => {
    const shareText = `
Medicine: ${prescription.medicineName}
Strength: ${prescription.strength}
Dosage: ${prescription.dosage}
Doctor: ${prescription.doctorProfile}
Prescribed: ${prescription.prescribedDate}
Expires: ${prescription.expiryDate}
Notes: ${prescription.notes}
    `;
    
    if (navigator.share) {
      navigator.share({
        title: "Prescription",
        text: shareText
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Prescription details copied to clipboard!");
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "#10b981" : "#ef4444";
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch =
      p.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctorProfile.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && p.status === "Active") ||
      (filterStatus === "expiring" && isExpiringSoon(p.expiryDate));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="prescription-manager">
      <header className="prescription-header">
        <h1>Prescription Management</h1>
        <Link to="/dashboard">Back to Home</Link>
      </header>

      <div className="prescription-content">
        {/* Header Section */}
        <div className="prescription-top">
          <button
            className="upload-btn"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? "✕ Cancel" : "+ Upload Prescription"}
          </button>

          <div className="search-filters">
            <input
              type="text"
              placeholder="Search medicines or doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active Only</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="upload-form-container">
            <h2>Add New Prescription</h2>
            <form onSubmit={handleAddPrescription} className="prescription-form">
              <div className="form-row">
                <label>
                  Medicine Name:
                  <input
                    type="text"
                    name="medicineName"
                    value={uploadData.medicineName}
                    onChange={handleInputChange}
                    placeholder="e.g., Aspirin"
                    required
                  />
                </label>
                <label>
                  Strength:
                  <input
                    type="text"
                    name="strength"
                    value={uploadData.strength}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg"
                    required
                  />
                </label>
              </div>

              <label>
                Dosage:
                <input
                  type="text"
                  name="dosage"
                  value={uploadData.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 tablet, 2 times daily"
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Duration:
                  <input
                    type="text"
                    name="duration"
                    value={uploadData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 days"
                    required
                  />
                </label>
                <label>
                  Doctor:
                  <input
                    type="text"
                    name="doctorProfile"
                    value={uploadData.doctorProfile}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Sarah Johnson"
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Prescribed Date:
                  <input
                    type="date"
                    name="prescribedDate"
                    value={uploadData.prescribedDate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Expiry Date:
                  <input
                    type="date"
                    name="expiryDate"
                    value={uploadData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <label>
                Notes:
                <textarea
                  name="notes"
                  value={uploadData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g., Take after meals..."
                />
              </label>

              <label>
                Upload Prescription Image (Optional):
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImageUpload}
                />
                {ocrLoading && <p className="ocr-loading">🔍 Extracting text from image...</p>}
              </label>

              <button type="submit" className="submit-btn">
                Add Prescription
              </button>
            </form>
          </div>
        )}

        {/* Prescriptions Grid */}
        <div className="prescriptions-container">
          {filteredPrescriptions.length === 0 ? (
            <p className="no-prescriptions">No prescriptions found.</p>
          ) : (
            <div className="prescriptions-grid">
              {filteredPrescriptions.map(prescription => (
                <div
                  key={prescription.id}
                  className={`prescription-card ${isExpired(prescription.expiryDate) ? "expired" : ""}`}
                >
                  {/* Status Badge */}
                  <div className="prescription-badge">
                    {isExpired(prescription.expiryDate) ? (
                      <span className="expired-badge">Expired</span>
                    ) : isExpiringSoon(prescription.expiryDate) ? (
                      <span className="expiring-badge">Expiring Soon</span>
                    ) : (
                      <span className="active-badge">Active</span>
                    )}
                  </div>

                  {/* Medicine Info */}
                  <div className="medicine-info">
                    <h3>{prescription.medicineName}</h3>
                    <p className="strength">{prescription.strength}</p>
                  </div>

                  {/* Details */}
                  <div className="prescription-details">
                    <div className="detail-item">
                      <strong>Dosage:</strong>
                      <p>{prescription.dosage}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong>
                      <p>{prescription.duration}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Doctor:</strong>
                      <p>{prescription.doctorProfile}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Prescribed:</strong>
                      <p>{prescription.prescribedDate}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Expires:</strong>
                      <p>{prescription.expiryDate}</p>
                    </div>
                    {prescription.notes && (
                      <div className="detail-item">
                        <strong>Notes:</strong>
                        <p>{prescription.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="prescription-actions">
                    <button className="view-btn" onClick={() => setSelectedPrescription(prescription)}>
                      View Details
                    </button>
                    <button 
                      className="interactions-btn" 
                      onClick={() => {
                        setSelectedForInteraction(prescription);
                        setShowInteractions(true);
                      }}
                    >
                      🔬 Check Interactions
                    </button>
                    <button className="delete-btn" onClick={() => handleDeletePrescription(prescription.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Prescription Management Features</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>📱 OCR Recognition</h3>
              <p>Automatically extract medicine details from prescription images. Upload and auto-fill forms!</p>
              <button className="action-btn active">✓ Active</button>
            </div>
            <div className="action-card">
              <h3>🔔 Expiry Alerts</h3>
              <p>Get notified before your prescriptions expire so you can refill in time.</p>
              <button className="action-btn active">✓ Active</button>
            </div>
            <div className="action-card">
              <h3>💊 Drug Interactions</h3>
              <p>Check for potential interactions between your medicines automatically.</p>
              <button className="action-btn active">✓ Active</button>
            </div>
            <div className="action-card">
              <h3>🔄 Auto-Refill</h3>
              <p>Request refills from your pharmacy with one click. Track refill history.</p>
              <button className="action-btn active">✓ Active</button>
            </div>
            <div className="action-card">
              <h3>📤 Share Prescription</h3>
              <p>Share prescription details with doctors or family members instantly.</p>
              <button className="action-btn active">✓ Active</button>
            </div>
            <div className="action-card">
              <h3>💾 Download Records</h3>
              <p>Export your prescription history as PDF for medical records and insurance.</p>
              <button className="action-btn active">✓ Active</button>
            </div>
          </div>
        </section>
      </div>

      {/* Details Modal */}
      {selectedPrescription && (
        <div className="modal-overlay" onClick={() => setSelectedPrescription(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPrescription(null)}>✕</button>
            <div className="modal-body">
              <h2>{selectedPrescription.medicineName}</h2>
              <div className="modal-details">
                <p><strong>Strength:</strong> {selectedPrescription.strength}</p>
                <p><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
                <p><strong>Duration:</strong> {selectedPrescription.duration}</p>
                <p><strong>Doctor:</strong> {selectedPrescription.doctorProfile}</p>
                <p><strong>Prescribed Date:</strong> {selectedPrescription.prescribedDate}</p>
                <p><strong>Expiry Date:</strong> {selectedPrescription.expiryDate}</p>
                {selectedPrescription.notes && (
                  <p><strong>Notes:</strong> {selectedPrescription.notes}</p>
                )}
                {selectedPrescription.interactions && selectedPrescription.interactions.length > 0 && (
                  <div className="interactions-alert">
                    <strong>⚠️ Potential Interactions:</strong>
                    {selectedPrescription.interactions.map((interaction, idx) => (
                      <p key={idx}>{interaction.conflictingMedicine}</p>
                    ))}
                  </div>
                )}
                <p className="refill-info"><strong>Refill Requests:</strong> {selectedPrescription.refillCount}</p>
              </div>
              {selectedPrescription.prescriptionImage && (
                <div className="prescription-image">
                  <img src={URL.createObjectURL(selectedPrescription.prescriptionImage)} alt="Prescription" />
                </div>
              )}
              <div className="modal-actions">
                <button 
                  className="refill-btn" 
                  onClick={() => {
                    handleRefillRequest(selectedPrescription.id);
                    setSelectedPrescription(null);
                  }}
                >
                  Request Refill
                </button>
                <button 
                  className="share-btn" 
                  onClick={() => {
                    handleSharePrescription(selectedPrescription);
                  }}
                >
                  📤 Share
                </button>
                <button 
                  className="download-btn" 
                  onClick={() => {
                    alert("PDF download feature coming soon!");
                  }}
                >
                  📥 Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drug Interactions Modal */}
      {showInteractions && selectedForInteraction && (
        <div className="modal-overlay" onClick={() => setShowInteractions(false)}>
          <div className="modal-content interaction-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowInteractions(false)}>✕</button>
            <div className="modal-body">
              <h2>🔬 Drug Interaction Check</h2>
              <p className="medicine-name">{selectedForInteraction.medicineName}</p>
              
              <div className="interaction-details">
                <h3>Known Drug Database</h3>
                {DRUG_INTERACTIONS[selectedForInteraction.medicineName] ? (
                  <div className="interactions-list">
                    <p className="list-title">May interact with:</p>
                    <ul>
                      {DRUG_INTERACTIONS[selectedForInteraction.medicineName].map((drug, idx) => (
                        <li key={idx}>{drug}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="no-interactions">No known interactions in database</p>
                )}

                <h3>Current Prescriptions Analysis</h3>
                {checkDrugInteractions(selectedForInteraction.medicineName).length > 0 ? (
                  <div className="current-interactions">
                    {checkDrugInteractions(selectedForInteraction.medicineName).map((interaction, idx) => (
                      <div key={idx} className="interaction-item warning">
                        <strong>⚠️ Conflict with {interaction.conflictingMedicine}</strong>
                        <p>{interaction.interactionType}</p>
                        <p className="recommendation">💡 Consider consulting your doctorProfile</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="safe-to-use">✓ Safe to use with current prescriptions</p>
                )}
              </div>

              <div className="interaction-tips">
                <h3>Safety Tips</h3>
                <ul>
                  <li>Always inform your doctorProfile about all medications you're taking</li>
                  <li>Check interactions before starting new medicines</li>
                  <li>Read medicine labels carefully</li>
                  <li>Report any unusual symptoms immediately</li>
                  <li>Don't stop medicines without consulting your doctorProfile</li>
                </ul>
              </div>

              <button 
                className="close-interaction-btn" 
                onClick={() => setShowInteractions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManager;