# MediCose - Advanced Medication Tracker & Healthcare Ecosystem

MediCose is a comprehensive, full-stack healthcare management platform designed to bridge the gap between patients, doctors, and pharmaceutical services. It provides a seamless workflow from consultation to medication delivery, powered by AI.

---

## 🚀 Key Features

### 👤 Patient Panel
*   **Smart Dashboard:** Real-time overview of health status and quick actions.
*   **Medical Profile:** Detailed record of vitals, allergies, known diseases, and symptoms.
*   **Appointment Booking:** Schedule consultations with assigned specialists.
*   **Digital Prescriptions:** View professional medical prescriptions sent by doctors.
*   **Integrated Pharmacy:** One-click "Buy Medicines" button inside prescriptions.
*   **Order Tracking:** Real-time progress bar for medicine home delivery (Ordered → Shipped → Arriving).
*   **AI Health Assistant:** Gemini-powered chatbot for instant health-related queries.

### 👨‍⚕️ Doctor Panel
*   **Patient Management:** View a dedicated list of assigned patients and their medical history.
*   **Consultation Suite:** A split-screen interface to view patient symptoms while writing prescriptions.
*   **Appointment Manager:** Confirm, cancel, or mark appointments as completed.
*   **Professional Profile:** Showcase specialization, degrees, and experience.

### 🛡️ Admin Panel
*   **Live Analytics:** Real-time statistics on total patients, doctors, appointments, and orders.
*   **Doctor-Patient Mapping:** Link patients to the most suitable doctors.
*   **Platform Oversight:** Monitor all appointments and pharmacy orders across the system.

---

## 🛠️ Tech Stack

**Backend:**
*   Java 21 (Spring Boot 3.4.2)
*   Spring Security with JWT (Stateless Authentication)
*   Spring Data JPA (Hibernate)
*   Spring Mail (OTP Integration)
*   MySQL Database

**Frontend:**
*   React.js (Vite)
*   Axios (API Interceptors for JWT)
*   CSS3 (Custom Professional Medical Theme)

**AI Integration:**
*   Google Gemini Pro API (via Backend Proxy)

---

## 🔄 System Workflow

### 1. Authentication & Security
*   **Role-Based Registration:** Users choose their role (Patient/Doctor/Admin) during signup.
*   **Smart Login:** A single login interface that automatically identifies the user's role and redirects them to the correct dashboard.
*   **Secure Access:** Every request is authenticated via a JWT token stored in `sessionStorage`.
*   **Password Recovery:** Secure OTP-based reset system using real email notifications.

### 2. The Medical Cycle
1.  **Assignment:** Admin assigns a **Doctor** to a **Patient**.
2.  **Booking:** Patient requests an **Appointment**.
3.  **Confirmation:** Doctor reviews and **Confirms** the slot.
4.  **Prescription:** During consultation, the Doctor writes a **Digital Prescription** (Diagnosis + Medicines + Follow-up date).
5.  **Fulfillment:** Patient views the prescription and clicks **"Buy Medicines"**.
6.  **Delivery:** Patient enters their address, places an order, and **Tracks** the delivery status in real-time.

### 3. Data Integrity
*   **Auto-Polling:** The frontend fetches new data every 2 seconds, ensuring the UI is always "Live" without manual refreshes.
*   **Latest-First Sorting:** Prescriptions and Orders are automatically sorted to show the most recent activity at the top.

---

## 📦 Installation & Setup

### Backend Setup
1.  Ensure **MySQL** is running and create a database: `CREATE DATABASE medication_tracker;`
2.  Update `src/main/resources/application.properties`:
    *   Set `spring.datasource.password` to your MySQL password.
    *   Set `spring.mail.username` and `spring.mail.password` (Gmail App Password).
3.  Run the application using Maven: `./mvnw spring-boot:run`

### Frontend Setup
1.  Navigate to the frontend folder: `cd Info-MedicationTracker-main`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

---

## 🛡️ Security Configuration
The system uses a robust security filter chain:
*   **Public Routes:** `/login`, `/register`, `/password-reset/**`
*   **Private Routes:** All dashboard, profile, and pharmacy actions require a valid JWT.

---

## 🔮 Future Roadmap
*   **Payment Gateway:** Integration with Razorpay for medicine payments.
*   **Video Consultation:** Integrated WebRTC for live doctor-patient calls.
*   **Lab Reports:** PDF upload and AI-based report analysis.
*   **Mobile App:** Cross-platform mobile version using React Native.

---
Developed with ❤️ for the Healthcare Community.
