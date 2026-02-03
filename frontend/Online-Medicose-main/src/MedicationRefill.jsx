import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MedicationRefill.css";

const MedicationRefill = () => {
  const [refillRequests, setRefillRequests] = useState([
    {
      id: 1,
      medicineName: "Aspirin",
      dosage: "500mg",
      quantity: 30,
      pharmacy: "HealthCare Plus Pharmacy",
      status: "pending",
      requestDate: "2026-01-10",
      estimatedDelivery: "2026-01-12",
      cost: "₹450"
    },
    {
      id: 2,
      medicineName: "Metformin",
      dosage: "1000mg",
      quantity: 60,
      pharmacy: "City Medical Store",
      status: "approved",
      requestDate: "2026-01-08",
      estimatedDelivery: "2026-01-11",
      cost: "₹800"
    },
    {
      id: 3,
      medicineName: "Lisinopril",
      dosage: "10mg",
      quantity: 30,
      pharmacy: "HealthCare Plus Pharmacy",
      status: "delivered",
      requestDate: "2026-01-05",
      deliveredDate: "2026-01-07",
      cost: "₹320"
    }
  ]);

  const [medications, setMedications] = useState([
    { id: 1, name: "Aspirin", dosage: "500mg", quantity: 5, nextRefillDate: "2026-01-15" },
    { id: 2, name: "Metformin", dosage: "1000mg", quantity: 20, nextRefillDate: "2026-01-20" },
    { id: 3, name: "Lisinopril", dosage: "10mg", quantity: 15, nextRefillDate: "2026-01-25" },
    { id: 4, name: "Amlodipine", dosage: "5mg", quantity: 8, nextRefillDate: "2026-01-18" }
  ]);

  const [pharmacies] = useState([
    { id: 1, name: "HealthCare Plus Pharmacy", rating: 4.8, deliveryTime: "2 days", distance: "2.5 km" },
    { id: 2, name: "City Medical Store", rating: 4.6, deliveryTime: "1 day", distance: "5.2 km" },
    { id: 3, name: "Express Pharmacy", rating: 4.9, deliveryTime: "Same day", distance: "3.8 km" },
    { id: 4, name: "Metro Health Mart", rating: 4.5, deliveryTime: "3 days", distance: "8.1 km" }
  ]);

  const [showRefillForm, setShowRefillForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [refillFormData, setRefillFormData] = useState({
    medicationId: "",
    quantity: "",
    pharmacyId: "",
    notes: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRefillFormData({ ...refillFormData, [name]: value });
  };

  const handleRequestRefill = (e) => {
    e.preventDefault();
    
    const medication = medications.find(m => m.id === parseInt(refillFormData.medicationId));
    const pharmacy = pharmacies.find(p => p.id === parseInt(refillFormData.pharmacyId));

    if (medication && pharmacy) {
      const newRequest = {
        id: Date.now(),
        medicineName: medication.name,
        dosage: medication.dosage,
        quantity: parseInt(refillFormData.quantity),
        pharmacy: pharmacy.name,
        status: "pending",
        requestDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cost: "₹" + (Math.random() * 1000).toFixed(0)
      };

      setRefillRequests([newRequest, ...refillRequests]);
      setRefillFormData({ medicationId: "", quantity: "", pharmacyId: "", notes: "" });
      setShowRefillForm(false);
    }
  };

  const handleCancelRefill = (id) => {
    setRefillRequests(refillRequests.map(r => 
      r.id === id && r.status === "pending" ? { ...r, status: "cancelled" } : r
    ));
  };

  const handleAutoRefill = (medicationId) => {
    alert(`Auto-refill enabled for medication ID: ${medicationId}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "#f59e0b";
      case "approved": return "#667eea";
      case "delivered": return "#10b981";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "pending": return "🔄 Pending";
      case "approved": return "✓ Approved";
      case "delivered": return "📦 Delivered";
      case "cancelled": return "✕ Cancelled";
      default: return status;
    }
  };

  const isLowStock = (quantity) => quantity <= 10;
  const isRunningOut = (quantity) => quantity <= 5;

  return (
    <div className="medication-refill">
      <header className="refill-header">
        <h1>Medication Refill</h1>
        <Link to="/">Back to Home</Link>
      </header>

      <div className="refill-content">
        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button
            className="action-btn primary-btn"
            onClick={() => setShowRefillForm(!showRefillForm)}
          >
            {showRefillForm ? "✕ Cancel" : "+ Request Refill"}
          </button>
          <button className="action-btn secondary-btn">
            ⚙️ Manage Auto-Refill
          </button>
          <button className="action-btn secondary-btn">
            📍 Find Pharmacies
          </button>
        </div>

        {/* Refill Request Form */}
        {showRefillForm && (
          <div className="refill-form-container">
            <h2>Request Medication Refill</h2>
            <form onSubmit={handleRequestRefill} className="refill-form">
              <div className="form-group">
                <label>
                  Select Medication:
                  <select
                    name="medicationId"
                    value={refillFormData.medicationId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a medication...</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.name} - {med.dosage} (Remaining: {med.quantity})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={refillFormData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 30"
                    min="1"
                    required
                  />
                </label>
                <label>
                  Preferred Pharmacy:
                  <select
                    name="pharmacyId"
                    value={refillFormData.pharmacyId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a pharmacy...</option>
                    {pharmacies.map(pharm => (
                      <option key={pharm.id} value={pharm.id}>
                        {pharm.name} - {pharm.deliveryTime}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Additional Notes:
                <textarea
                  name="notes"
                  value={refillFormData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions..."
                  rows="3"
                />
              </label>

              <button type="submit" className="submit-btn">
                Request Refill
              </button>
            </form>
          </div>
        )}

        {/* Current Stock Status */}
        <section className="stock-section">
          <h2>Current Medication Stock</h2>
          <div className="medications-grid">
            {medications.map(med => (
              <div
                key={med.id}
                className={`medication-card ${isRunningOut(med.quantity) ? "critical" : isLowStock(med.quantity) ? "warning" : ""}`}
              >
                <div className="med-header">
                  <div className="med-info">
                    <h3>{med.name}</h3>
                    <p>{med.dosage}</p>
                  </div>
                  <div className="med-stock">
                    <span className="stock-number">{med.quantity}</span>
                    <span className="stock-label">remaining</span>
                  </div>
                </div>

                <div className="stock-bar">
                  <div className="stock-fill" style={{width: Math.min(med.quantity * 3, 100) + "%"}}></div>
                </div>

                {isRunningOut(med.quantity) && (
                  <p className="stock-alert critical">🔴 Running out! Order now</p>
                )}
                {isLowStock(med.quantity) && !isRunningOut(med.quantity) && (
                  <p className="stock-alert warning">🟡 Stock running low</p>
                )}

                <div className="med-footer">
                  <span>Next refill: {med.nextRefillDate}</span>
                </div>

                <div className="med-actions">
                  <button
                    className="refill-btn"
                    onClick={() => {
                      setRefillFormData({ ...refillFormData, medicationId: med.id.toString() });
                      setShowRefillForm(true);
                    }}
                  >
                    Request Refill
                  </button>
                  <button
                    className="auto-refill-btn"
                    onClick={() => handleAutoRefill(med.id)}
                  >
                    Auto-Refill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refill Requests History */}
        <section className="requests-section">
          <h2>Refill Requests History</h2>
          <div className="requests-container">
            {refillRequests.length === 0 ? (
              <p className="no-requests">No refill requests yet.</p>
            ) : (
              <div className="requests-list">
                {refillRequests.map(request => (
                  <div
                    key={request.id}
                    className="request-card"
                    style={{ borderLeftColor: getStatusColor(request.status) }}
                  >
                    <div className="request-header">
                      <div className="medicine-details">
                        <h3>{request.medicineName}</h3>
                        <p>{request.dosage}</p>
                      </div>
                      <div className="status-container">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>

                    <div className="request-details">
                      <div className="detail">
                        <span className="label">📦 Quantity:</span>
                        <span>{request.quantity} tablets</span>
                      </div>
                      <div className="detail">
                        <span className="label">🏪 Pharmacy:</span>
                        <span>{request.pharmacy}</span>
                      </div>
                      <div className="detail">
                        <span className="label">📅 Requested:</span>
                        <span>{request.requestDate}</span>
                      </div>
                      <div className="detail">
                        <span className="label">🚚 Delivery:</span>
                        <span>{request.estimatedDelivery || request.deliveredDate}</span>
                      </div>
                      <div className="detail">
                        <span className="label">💰 Cost:</span>
                        <span>{request.cost}</span>
                      </div>
                    </div>

                    <div className="request-actions">
                      {request.status === "pending" && (
                        <>
                          <button className="track-btn">Track Order</button>
                          <button
                            className="cancel-btn"
                            onClick={() => handleCancelRefill(request.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <button className="track-btn">Track Delivery</button>
                      )}
                      {request.status === "delivered" && (
                        <button className="feedback-btn">Leave Feedback</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Available Pharmacies */}
        <section className="pharmacies-section">
          <h2>Available Pharmacies</h2>
          <div className="pharmacies-grid">
            {pharmacies.map(pharmacy => (
              <div key={pharmacy.id} className="pharmacy-card">
                <div className="pharmacy-header">
                  <h3>{pharmacy.name}</h3>
                  <span className="rating">⭐ {pharmacy.rating}</span>
                </div>

                <div className="pharmacy-info">
                  <div className="info-item">
                    <span className="info-label">🚚 Delivery Time:</span>
                    <span>{pharmacy.deliveryTime}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Distance:</span>
                    <span>{pharmacy.distance}</span>
                  </div>
                </div>

                <div className="pharmacy-actions">
                  <button className="order-btn">Order Now</button>
                  <button className="details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Auto-Refill Setup */}
        <section className="auto-refill-section">
          <h2>Auto-Refill Setup</h2>
          <div className="auto-refill-card">
            <h3>Automatic Refill Benefits</h3>
            <ul>
              <li>✓ Never run out of medications</li>
              <li>✓ Automatic delivery based on your schedule</li>
              <li>✓ Special discounts on auto-refill orders</li>
              <li>✓ Cancel or modify anytime</li>
              <li>✓ Track deliveries in real-time</li>
            </ul>
            <button className="setup-btn">Set Up Auto-Refill</button>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="tips-section">
          <h2>Helpful Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">💡</span>
              <h3>Plan Ahead</h3>
              <p>Request refills before you run out to avoid missing doses.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🏪</span>
              <h3>Compare Prices</h3>
              <p>Check different pharmacies for the best prices and delivery times.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📦</span>
              <h3>Track Orders</h3>
              <p>Use the tracking feature to know when your medicines will arrive.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🔔</span>
              <h3>Get Alerts</h3>
              <p>Enable notifications to get reminded about low stock automatically.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MedicationRefill;