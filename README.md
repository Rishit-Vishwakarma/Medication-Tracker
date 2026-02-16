# MediCose - Advanced Medication Tracker & Healthcare Ecosystem

MediCose is a comprehensive, full-stack healthcare management platform designed to bridge the gap between patients, doctors, and pharmaceutical services. It provides a seamless workflow from consultation to medication delivery, powered by high-speed AI.

---

## 🚀 Key Features

### 👤 Patient Panel
*   **Live Dashboard Summary:** Real-time overview of next appointments, latest prescriptions, and order status.
*   **Medical Profile Lock:** Ensures data integrity by requiring profile completion before unlocking features.
*   **Lab Report Manager:** Upload and manage medical test reports (Images/PDFs) for doctor review.
*   **Smart Appointments:** Integrated booking and history tracking in a single unified interface.
*   **AI Health Assistant:** **Groq-powered (Llama 3.3)** context-aware chatbot that knows your medical history.
*   **Real-time Notifications:** Instant alerts for appointment confirmations, doctor assignments, and order updates.

### 👨‍⚕️ Doctor Panel
*   **Practice Dashboard:** High-level analytics showing total patients, today's visits, and pending requests.
*   **Interactive Filtering:** Quick-filter appointments by "Today" or "Pending" directly from the dashboard.
*   **Consultation Suite:** View patient symptoms and **Lab Reports** side-by-side while writing prescriptions.
*   **Professional Branding:** Showcase specialization, degrees, and clinic details to patients.

### 🛡️ Admin Panel
*   **Smart Triage:** Match patients with doctors based on symptoms and doctor specialization.
*   **Medical Records Hub:** Centralized access to audit all patient reports and doctor credentials.
*   **Pharmacy Management:** Oversee all medicine orders and update delivery status (Shipped/Delivered).
*   **Platform Analytics:** Real-time stats on the entire healthcare ecosystem.

---

## 🛠️ Tech Stack

**Backend:**
*   Java 21 (Spring Boot 3.4.2)
*   Spring Security with JWT (Stateless Authentication)
*   Spring Data JPA (Hibernate)
*   MySQL Database (Relational Storage)
*   Spring Mail (OTP Integration)

**Frontend:**
*   React.js (Vite)
*   Axios (API Interceptors for JWT)
*   CSS3 (Scoped Styles for UI Isolation)

**AI Integration:**
*   **Groq API (Llama 3.3 Model):** Ultra-fast inference with RAG (Retrieval-Augmented Generation) for personalized medical advice.

---

## 🔄 System Workflow

### 1. Security & Onboarding
*   **Unified Login:** Automatically detects role (Patient/Doctor/Admin) and redirects.
*   **Profile Lock:** New users are guided to complete their profile to unlock the full dashboard.
*   **JWT Security:** Secure token-based access for all private endpoints.

### 2. The Medical Cycle
1.  **Smart Assignment:** Admin matches a Patient's symptoms with a Doctor's expertise.
2.  **Consultation:** Patient books an appointment; Doctor reviews reports and writes a digital prescription.
3.  **Pharmacy:** Patient buys medicines directly from the prescription; tracks delivery in real-time.
4.  **AI Support:** Patient asks the chatbot about their specific medicines or next appointment.

---

## 📦 Installation & Setup

### Backend Setup
1.  Ensure **MySQL** is running and create a database: `CREATE DATABASE medication_tracker;`
2.  Configure **Environment Variables** (Recommended) or update `application.properties`:
    *   `DB_PASSWORD`: Your MySQL password.
    *   `MAIL_USERNAME` / `MAIL_PASSWORD`: Gmail App Password for OTPs.
    *   `GROQ_API_KEY`: Your Groq API key for the chatbot.
3.  Run the application: `./mvnw spring-boot:run`

### Frontend Setup
1.  Navigate to the frontend folder: `cd Info-MedicationTracker-main`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

---

## 🛡️ Security Configuration
The system uses a robust security filter chain:
*   **Public Routes:** `/login`, `/register`, `/password-reset/**`
*   **Private Routes:** All dashboard, profile, and pharmacy actions require a valid JWT with role-based permissions.

---

## 🔮 Future Roadmap
*   **AI Lab Report Analyzer:** Automatic OCR-based analysis of uploaded blood tests.
*   **Video Consultation:** Integrated WebRTC for live doctor-patient calls.
*   **Payment Gateway:** Integration with Razorpay for medicine payments.
*   **Mobile App:** Cross-platform mobile version using React Native.

---
