import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    } else {
      // Default demo data if nothing in storage
      setAppointments([
        {
          id: 1,
          doctorProfile: "Dr. Sarah Johnson",
          specialty: "Cardiologist",
          date: "2026-01-10",
          time: "10:00 AM",
          reason: "Regular checkup",
          status: "upcoming",
          notes: "Patient reports mild chest pain",
          patientName: "John Doe",
          patientAge: 45,
          type: "patient"
        },
        {
          id: 2,
          doctorProfile: "Dr. Michael Chen",
          specialty: "Dermatologist",
          date: "2026-01-05",
          time: "2:30 PM",
          reason: "Skin rash consultation",
          status: "completed",
          notes: "Prescribed antihistamine cream",
          patientName: "John Doe",
          patientAge: 45,
          type: "patient"
        }
      ]);
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarView, setCalendarView] = useState(false);
  const [viewMode, setViewMode] = useState("patient"); // patient, doctorProfile, caretaker
  const [bookingData, setBookingData] = useState({
    doctorProfile: "",
    specialty: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
    patientName: "",
    patientAge: ""
  });
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointmentForPrescription, setSelectedAppointmentForPrescription] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const doctors = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
    { name: "Dr. Michael Chen", specialty: "Dermatologist" },
    { name: "Dr. Emily Davis", specialty: "Neurologist" },
    { name: "Dr. Robert Wilson", specialty: "Orthopedic" },
    { name: "Dr. Lisa Brown", specialty: "Gynecologist" }
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...bookingData,
      status: "upcoming",
      type: viewMode
    };
    setAppointments([newAppointment, ...appointments]);
    setBookingData({
      doctorProfile: "",
      specialty: "",
      date: "",
      time: "",
      reason: "",
      notes: "",
      patientName: "",
      patientAge: ""
    });
    setShowBookingForm(false);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: "cancelled" } : apt
    ));
  };

  const handleRescheduleAppointment = (id) => {
    const appointment = appointments.find(apt => apt.id === id);
    setSelectedAppointment(appointment);
    setBookingData({
      doctorProfile: appointment.doctorProfile,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      notes: appointment.notes,
      patientName: appointment.patientName,
      patientAge: appointment.patientAge
    });
    setShowBookingForm(true);
  };

  const handleUpdateAppointment = (e) => {
    e.preventDefault();
    setAppointments(appointments.map(apt =>
      apt.id === selectedAppointment.id
        ? { ...apt, ...bookingData, status: "upcoming" }
        : apt
    ));
    setSelectedAppointment(null);
    setBookingData({
      doctorProfile: "",
      specialty: "",
      date: "",
      time: "",
      reason: "",
      notes: "",
      patientName: "",
      patientAge: ""
    });
    setShowBookingForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "#10b981";
      case "completed": return "#3b82f6";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming");
  const todayAppointments = appointments.filter(apt =>
    apt.date === new Date().toISOString().split('T')[0] && apt.status === "upcoming"
  );

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleUploadPrescription = (appointment) => {
    setSelectedAppointmentForPrescription(appointment);
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (prescriptionFile && selectedAppointmentForPrescription) {
      const fileURL = URL.createObjectURL(prescriptionFile);
      // Update appointment with prescription
      setAppointments(appointments.map(apt =>
        apt.id === selectedAppointmentForPrescription.id
          ? { ...apt, prescription: { name: prescriptionFile.name, url: fileURL } }
          : apt
      ));
      alert("Prescription uploaded successfully!");
      setPrescriptionFile(null);
      setShowPrescriptionModal(false);
      setSelectedAppointmentForPrescription(null);
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopNavbar />

      <main className="dashboard-main">
        <div className="appointments-container">
          <header className="appointments-header">
            <h1>Doctor Appointments</h1>
          </header>

          <div className="appointments-content">
            {/* View Mode Selector */}
            <div className="view-selector">
              <button
                className={viewMode === "patient" ? "active" : ""}
            onClick={() => setViewMode("patient")}
          >
            Patient View
          </button>
          <button
            className={viewMode === "doctorProfile" ? "active" : ""}
            onClick={() => setViewMode("doctorProfile")}
          >
            Doctor View
          </button>
          <button
            className={viewMode === "caretaker" ? "active" : ""}
            onClick={() => setViewMode("caretaker")}
          >
            Caretaker View
          </button>
        </div>

        {/* Quick Stats */}
        <div className="appointment-stats">
          <div className="stat-card">
            <h3>Upcoming</h3>
            <p>{upcomingAppointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Today</h3>
            <p>{todayAppointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total</h3>
            <p>{appointments.length}</p>
          </div>
        </div>

        {/* Book New Appointment Button */}
        <div className="appointment-actions">
          <button
            className="book-btn"
            onClick={() => {
              setSelectedAppointment(null);
              setShowBookingForm(true);
            }}
          >
            Book New Appointment
          </button>
          <button
            className={`view-toggle-btn ${calendarView ? 'active' : ''}`}
            onClick={() => setCalendarView(!calendarView)}
          >
            {calendarView ? '📋 List View' : '📅 Calendar View'}
          </button>
        </div>

        {/* Booking/Reschedule Form */}
        {showBookingForm && (
          <div className="booking-modal">
            <div className="booking-form-container">
              <h2>{selectedAppointment ? "Reschedule Appointment" : "Book New Appointment"}</h2>
              <form onSubmit={selectedAppointment ? handleUpdateAppointment : handleBookAppointment}>
                {(viewMode === "caretaker" || viewMode === "doctorProfile") && (
                  <>
                    <label>
                      Patient Name:
                      <input
                        type="text"
                        name="patientName"
                        value={bookingData.patientName}
                        onChange={handleBookingChange}
                        required
                      />
                    </label>
                    <label>
                      Patient Age:
                      <input
                        type="number"
                        name="patientAge"
                        value={bookingData.patientAge}
                        onChange={handleBookingChange}
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  Doctor:
                  <select
                    name="doctorProfile"
                    value={bookingData.doctorProfile}
                    onChange={(e) => {
                      const selectedDoctor = doctors.find(d => d.name === e.target.value);
                      setBookingData({
                        ...bookingData,
                        doctorProfile: e.target.value,
                        specialty: selectedDoctor ? selectedDoctor.specialty : ""
                      });
                    }}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctorProfile, index) => (
                      <option key={index} value={doctorProfile.name}>
                        {doctorProfile.name} - {doctorProfile.specialty}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </label>

                <label>
                  Time:
                  <select
                    name="time"
                    value={bookingData.time}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Reason:
                  <input
                    type="text"
                    name="reason"
                    value={bookingData.reason}
                    onChange={handleBookingChange}
                    placeholder="e.g., Regular checkup, Consultation"
                    required
                  />
                </label>

                <label>
                  Notes:
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="Additional notes..."
                  />
                </label>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {selectedAppointment ? "Update Appointment" : "Book Appointment"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedAppointment(null);
                      setBookingData({
                        doctorProfile: "",
                        specialty: "",
                        date: "",
                        time: "",
                        reason: "",
                        notes: "",
                        patientName: "",
                        patientAge: ""
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Prescription Upload Modal */}
        {showPrescriptionModal && (
          <div className="booking-modal">
            <div className="booking-form-container">
              <h2>Upload Prescription</h2>
              <p className="modal-info">
                Appointment: {selectedAppointmentForPrescription?.doctorProfile} - {selectedAppointmentForPrescription?.date} {selectedAppointmentForPrescription?.time}
              </p>
              <form onSubmit={handlePrescriptionSubmit}>
                <label>
                  Select Prescription File (PDF, JPG, PNG):
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handlePrescriptionFileChange}
                    required
                  />
                </label>
                {prescriptionFile && (
                  <p className="file-info">Selected file: {prescriptionFile.name}</p>
                )}
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Upload Prescription</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowPrescriptionModal(false);
                      setPrescriptionFile(null);
                      setSelectedAppointmentForPrescription(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments List or Calendar View */}
        {calendarView ? (
          <div className="calendar-section">
            <div className="calendar-header">
              <h2>Calendar View</h2>
              <div className="calendar-controls">
                <button onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
                <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => navigateMonth(1)} className="nav-btn">›</button>
              </div>
            </div>

            <div className="calendar-grid">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                return (
                  <div
                    key={index}
                    className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <span className="day-number">{date.getDate()}</span>
                        {dayAppointments.length > 0 && (
                          <div className="appointment-indicators">
                            {dayAppointments.slice(0, 3).map((apt, i) => (
                              <div
                                key={i}
                                className={`appointment-dot ${apt.status}`}
                                title={`${apt.doctorProfile} - ${apt.time}`}
                              />
                            ))}
                            {dayAppointments.length > 3 && (
                              <span className="more-appointments">+{dayAppointments.length - 3}</span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected date details */}
            {selectedDate && (
              <div className="selected-date-details">
                <h3>{formatDate(selectedDate)}</h3>
                <div className="date-appointments">
                  {getAppointmentsForDate(selectedDate).length === 0 ? (
                    <p>No appointments scheduled for this date.</p>
                  ) : (
                    getAppointmentsForDate(selectedDate).map(appointment => (
                      <div key={appointment.id} className={`mini-appointment-card ${appointment.status}`}>
                        <div className="mini-appointment-info">
                          <h4>{appointment.doctorProfile}</h4>
                          <p>{appointment.specialty}</p>
                          <p><strong>Time:</strong> {appointment.time}</p>
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          {(viewMode === "doctorProfile" || viewMode === "caretaker") && (
                            <p><strong>Patient:</strong> {appointment.patientName}, Age: {appointment.patientAge}</p>
                          )}
                        </div>
                        <div className="mini-appointment-status">
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Appointments List */}
            <div className="appointments-list">
              <h2>
                {viewMode === "doctorProfile" ? "Today's Appointments" :
                 viewMode === "caretaker" ? "Patient Appointments" :
                 "My Appointments"}
              </h2>

              {appointments.length === 0 ? (
                <p className="no-appointments">No appointments scheduled.</p>
              ) : (
                appointments.map(appointment => (
                  <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                    <div className="appointment-header">
                      <div className="appointment-info">
                        <h3>{appointment.doctorProfile}</h3>
                        <p className="specialty">{appointment.specialty}</p>
                        <div className="appointment-details">
                          <span className="date">{appointment.date}</span>
                          <span className="time">{appointment.time}</span>
                        </div>
                      </div>
                      <div className="appointment-status">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="appointment-body">
                      <p><strong>Reason:</strong> {appointment.reason}</p>
                      {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                      {(viewMode === "doctorProfile" || viewMode === "caretaker") && (
                        <p><strong>Patient:</strong> {appointment.patientName}, Age: {appointment.patientAge}</p>
                      )}
                    </div>

                    {appointment.status === "upcoming" && viewMode !== "doctorProfile" && (
                      <div className="appointment-actions">
                        <button
                          className="reschedule-btn"
                          onClick={() => handleRescheduleAppointment(appointment.id)}
                        >
                          Reschedule
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {appointment.status === "completed" && (
                      <div className="appointment-actions">
                        <button 
                          className="prescription-btn"
                          onClick={() => handleUploadPrescription(appointment)}
                          type="button"
                        >
                          Upload Prescription
                        </button>
                        <button className="video-btn">Video Consultation</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;