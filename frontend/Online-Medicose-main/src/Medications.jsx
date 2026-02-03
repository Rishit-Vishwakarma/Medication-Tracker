import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./Medications.css";

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMed, setNewMed] = useState({
    drugName: "",
    strength: "",
    dosageForm: "",
    prescription: null,
    isGeneric: false,
    dosage: "",
    frequency: "",
    medicationTimes: [],
    refillReminder: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setNewMed({ ...newMed, [name]: files[0] });
    } else {
      setNewMed({ ...newMed, [name]: type === "checkbox" ? checked : value });
    }
    setErrors({ ...errors, [name]: "" });
    setSuccess("");
  };

  const validateMed = () => {
    const newErrors = {};
    if (!newMed.drugName.trim()) newErrors.drugName = "Drug name is required.";
    if (!newMed.dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!newMed.frequency) newErrors.frequency = "Frequency is required.";
    if (!newMed.startDate) newErrors.startDate = "Start date is required.";
    if (newMed.endDate && new Date(newMed.endDate) <= new Date(newMed.startDate)) {
      newErrors.endDate = "End date must be after start date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateMed()) return;
    setLoading(true);
    setErrors({});
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (editingId) {
        setMedications(medications.map(med => med.id === editingId ? { ...newMed, id: editingId } : med));
        setSuccess("Medication updated successfully!");
      } else {
        setMedications([...medications, { ...newMed, id: Date.now() }]);
        setSuccess("Medication added successfully!");
      }
      setNewMed({
        drugName: "",
        strength: "",
        dosageForm: "",
        prescription: null,
        isGeneric: false,
        dosage: "",
        frequency: "",
        medicationTimes: [],
        refillReminder: "",
        startDate: "",
        endDate: ""
      });
      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      setErrors({ general: "Failed to save medication. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewMed({
      drugName: "",
      strength: "",
      dosageForm: "",
      prescription: null,
      isGeneric: false,
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: ""
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (med) => {
    setNewMed(med);
    setEditingId(med.id);
    setIsAdding(true);
  };

  const addTime = () => {
    setNewMed({ ...newMed, medicationTimes: [...newMed.medicationTimes, ""] });
  };

  const updateTime = (index, value) => {
    const times = [...newMed.medicationTimes];
    times[index] = value;
    setNewMed({ ...newMed, medicationTimes: times });
  };

  const removeTime = (index) => {
    setNewMed({ ...newMed, medicationTimes: newMed.medicationTimes.filter((_, i) => i !== index) });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      setMedications(medications.filter(med => med.id !== id));
      setSuccess("Medication deleted successfully!");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopNavbar />

      <main className="dashboard-main">
        <div className="medications-container">
          <header className="medications-header">
            <h1>Medications</h1>
          </header>

          <div className="medications-content">
            <button onClick={() => setIsAdding(true)} className="add-btn" disabled={isAdding}>
              Add New Medication
            </button>

            {success && <div className="success-message">{success}</div>}
            {errors.general && <div className="error-message">{errors.general}</div>}

            {isAdding && (
          <div className="add-form">
            <h2>{editingId ? "Edit Medication" : "Add Medication"}</h2>
            <label>
              Drug Name:
              <input
                type="text"
                name="drugName"
                value={newMed.drugName}
                onChange={handleChange}
                placeholder="e.g., Aspirin"
                className={errors.drugName ? "error-input" : ""}
              />
              {errors.drugName && <span className="error">{errors.drugName}</span>}
            </label>
            <label>
              Strength:
              <input
                type="text"
                name="strength"
                value={newMed.strength}
                onChange={handleChange}
                placeholder="e.g., 500 mg"
              />
            </label>
            <label>
              Dosage Form:
              <select name="dosageForm" value={newMed.dosageForm} onChange={handleChange}>
                <option value="">Select</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="inhaler">Inhaler</option>
              </select>
            </label>
            <label>
              Prescription Upload:
              <input
                type="file"
                name="prescription"
                accept="image/*,.pdf"
                onChange={handleChange}
              />
              <small>Upload image or PDF. OCR extraction optional.</small>
            </label>
            <label>
              Is Generic:
              <input
                type="checkbox"
                name="isGeneric"
                checked={newMed.isGeneric}
                onChange={handleChange}
              />
            </label>
            <label>
              Dosage:
              <input
                type="text"
                name="dosage"
                value={newMed.dosage}
                onChange={handleChange}
                placeholder="e.g., 1 tablet"
                className={errors.dosage ? "error-input" : ""}
              />
              {errors.dosage && <span className="error">{errors.dosage}</span>}
            </label>
            <label>
              Frequency:
              <select name="frequency" value={newMed.frequency} onChange={handleChange} className={errors.frequency ? "error-input" : ""}>
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As Needed</option>
              </select>
              {errors.frequency && <span className="error">{errors.frequency}</span>}
            </label>
            <label>
              Medication Times:
              {newMed.medicationTimes.map((time, index) => (
                <div key={index} className="time-input">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                  />
                  <button type="button" onClick={() => removeTime(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addTime}>Add Time</button>
            </label>
            <label>
              Refill Reminder (days before):
              <input
                type="number"
                name="refillReminder"
                value={newMed.refillReminder}
                onChange={handleChange}
                placeholder="e.g., 7"
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={newMed.startDate}
                onChange={handleChange}
                className={errors.startDate ? "error-input" : ""}
              />
              {errors.startDate && <span className="error">{errors.startDate}</span>}
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={newMed.endDate}
                onChange={handleChange}
                className={errors.endDate ? "error-input" : ""}
              />
              {errors.endDate && <span className="error">{errors.endDate}</span>}
            </label>
            <div className="form-actions">
              <button onClick={handleAdd} className="save-btn" disabled={loading}>
                {loading ? "Saving..." : (editingId ? "Update" : "Add")}
              </button>
              <button onClick={handleCancel} className="cancel-btn" disabled={loading}>Cancel</button>
            </div>
          </div>
        )}

        <div className="medications-list">
          <h2>Your Medications</h2>
          {medications.length === 0 ? (
            <p>No medications added yet.</p>
          ) : (
            medications.map(med => (
              <div key={med.id} className="medication-card">
                <h3>{med.drugName} {med.isGeneric ? "(Generic)" : "(Brand)"}</h3>
                {med.strength && <p><strong>Strength:</strong> {med.strength}</p>}
                {med.dosageForm && <p><strong>Dosage Form:</strong> {med.dosageForm}</p>}
                {med.prescription && <p><strong>Prescription:</strong> {med.prescription.name}</p>}
                <p><strong>Dosage:</strong> {med.dosage}</p>
                {med.frequency && <p><strong>Frequency:</strong> {med.frequency}</p>}
                {med.medicationTimes.length > 0 && <p><strong>Times:</strong> {med.medicationTimes.join(", ")}</p>}
                {med.refillReminder && <p><strong>Refill Reminder:</strong> {med.refillReminder} days before</p>}
                {med.startDate && <p><strong>Start Date:</strong> {med.startDate}</p>}
                {med.endDate && <p><strong>End Date:</strong> {med.endDate}</p>}
                <div className="card-actions">
                  <button onClick={() => handleEdit(med)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(med.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="calendar-overview">
          <h2>Medication Schedule Overview</h2>
          {medications.length === 0 ? (
            <p>No schedule available.</p>
          ) : (
            <div className="schedule-list">
              {medications.map(med => (
                <div key={med.id} className="schedule-item">
                  <h4>{med.drugName}</h4>
                  <p>Next doses: {med.medicationTimes.map(time => `${time} (${med.frequency})`).join(", ")}</p>
                  <div className="reminder-actions">
                    <button className="snooze-btn">Snooze</button>
                    <button className="skip-btn">Skip</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Medications;