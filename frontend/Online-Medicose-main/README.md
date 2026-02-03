# Online Medicose - Comprehensive Medication Management System

## Overview
Online Medicose is a full-featured medication management application built with React that helps patients manage their medications, track adherence, schedule appointments, and maintain comprehensive health records. It includes support for doctors, caretakers, and multiple advanced health management features.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and signup with password validation
- **Medication Management**: Add, edit, delete, and schedule medications with time-based reminders
- **Doctor Appointments**: Book, track, and manage doctorProfile appointments with calendar view
- **User Profile**: Comprehensive profile with health information, emergency contacts, and document storage

### Advanced Features (New in v2.0)
- **In-App Notification Center**: Real-time notifications with filtering by type (appointment, medication, health, prescription)
- **Health Analytics Dashboard**: Visual charts showing medication adherence, health metrics, and trends
- **Prescription Management**: Upload and manage prescriptions with expiry tracking and refill alerts
- **Doctor Dashboard**: Multi-role interface for doctors to manage patients and appointments
- **Video Consultation**: Schedule and conduct secure video consultations with doctors
- **Medication Refill System**: Easy medication refill requests with pharmacy comparison and auto-refill options
- **Multi-User Support**: Different roles - Patient, Doctor, Caretaker

## 📁 Project Structure

```
src/
├── App.js                      # Main routing configuration
├── Home.jsx                    # Landing page with navigation
├── Login.jsx                   # User authentication
├── Signup.jsx                  # User registration with validation
├── Profile.jsx                 # User profile management
├── Medications.jsx             # Medication management & scheduling
├── Appointments.jsx            # Doctor appointment system
├── NotificationCenter.jsx       # In-app notifications (NEW)
├── HealthAnalytics.jsx         # Health dashboard & charts (NEW)
├── DoctorDashboard.jsx         # Doctor management interface (NEW)
├── PrescriptionManager.jsx     # Prescription handling (NEW)
├── VideoConsultation.jsx       # Video call scheduling (NEW)
├── MedicationRefill.jsx        # Medication refill requests (NEW)
└── [Component].css             # Corresponding CSS files
```

## 🎯 Components Overview

### Authentication
- **Login.jsx**: User login with email and password validation
- **Signup.jsx**: User registration with password strength requirements

### Main Pages
- **Home.jsx**: Landing page with features and navigation
- **Profile.jsx**: User profile with health information, documents, emergency contacts
- **Medications.jsx**: Medication tracking with scheduling and reminders

### Appointment System
- **Appointments.jsx**: Calendar-based appointment booking with multi-view support

### Advanced Features (New)
1. **NotificationCenter.jsx** 
   - Real-time notification management
   - Filter by type (appointment, medication, health, prescription)
   - Mark as read/unread, delete notifications
   - Badge showing unread count

2. **HealthAnalytics.jsx**
   - Bar chart visualization of medication adherence
   - Time-based views (week, month, year)
   - Health metrics display
   - Medication performance statistics
   - Health insights and recommendations

3. **DoctorDashboard.jsx**
   - Multi-tab interface (Overview, Patients, Appointments, Reports)
   - Patient management with adherence tracking
   - Appointment scheduling and tracking
   - Report generation for patient health data

4. **PrescriptionManager.jsx**
   - Upload and manage prescriptions
   - Track prescription expiry dates
   - Request refills from pharmacies
   - View detailed prescription information
   - Expiry alerts and reminders

5. **VideoConsultation.jsx**
   - Schedule consultations with doctors
   - Video call interface with controls
   - In-call chat functionality
   - Consultation history tracking
   - Feedback and ratings system

6. **MedicationRefill.jsx**
   - Request medication refills
   - Compare pharmacies by rating, delivery time, distance
   - Auto-refill setup
   - Track refill order status
   - Stock level monitoring with alerts

## 🛠️ Tech Stack

- **Frontend**: React 19 with React Router v6
- **Styling**: CSS3 with responsive design (Flexbox, Grid)
- **State Management**: React Hooks (useState)
- **Browser APIs**: FileReader for uploads, Date APIs
- **Architecture**: Component-based modular design

## 📱 Responsive Design

All components are fully responsive:
- **Desktop**: Full layout with multi-column grids and sidebars
- **Tablet**: Adjusted grid layouts with optimized spacing
- **Mobile**: Single column layouts with touch-friendly buttons

## 🔐 Security Features

- Password strength validation during signup
- Session-based authentication structure
- Secure form handling
- File upload validation for documents
- Data privacy considerations

## 🎨 UI/UX Features

- Gradient color scheme (purple/pink theme)
- Smooth transitions and hover effects
- Clear status indicators and color-coded badges
- Modal dialogs for detailed views
- Intuitive navigation with breadcrumbs
- Progress bars and loading indicators
- Toast-style notifications

## 📊 Data Models

### Medication
```javascript
{
  id: number,
  name: string,
  dosage: string,
  frequency: string,
  startDate: string,
  endDate: string,
  notes: string
}
```

### Appointment
```javascript
{
  id: number,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  reason: string,
  notes: string,
  status: 'scheduled' | 'completed' | 'cancelled'
}
```

### Prescription
```javascript
{
  id: number,
  medicineName: string,
  strength: string,
  dosage: string,
  duration: string,
  prescribedDate: string,
  expiryDate: string,
  doctorProfile: string,
  notes: string,
  status: 'Active' | 'Expired'
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/online-medicose.git
cd online-medicose
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with features |
| `/login` | Login | User login page |
| `/signup` | Signup | User registration page |
| `/profile` | Profile | User profile management |
| `/medications` | Medications | Medication management |
| `/appointments` | Appointments | Doctor appointments |
| `/notifications` | NotificationCenter | In-app notifications |
| `/health-analytics` | HealthAnalytics | Health dashboard |
| `/doctorProfile-dashboard` | DoctorDashboard | Doctor interface |
| `/prescriptions` | PrescriptionManager | Prescription management |
| `/video-consultation` | VideoConsultation | Video consultation |
| `/medication-refill` | MedicationRefill | Medication refill |

## 🔄 Future Enhancements

### Backend Integration (Priority: High)
- [ ] Node.js/Express server
- [ ] MongoDB database
- [ ] JWT authentication
- [ ] REST API endpoints for all features

### External Services (Priority: High)
- [ ] Push Notifications (Firebase Cloud Messaging)
- [ ] SMS Alerts (Twilio)
- [ ] Email Notifications (SendGrid)

### Advanced Features (Priority: Medium)
- [ ] OCR for prescription images (Tesseract.js)
- [ ] Real video calling (WebRTC/Jitsi)
- [ ] PDF report generation
- [ ] Drug interaction checker
- [ ] Medicine AI Q&A chatbot

### Mobile & Accessibility (Priority: Medium)
- [ ] React Native mobile app
- [ ] Progressive Web App (PWA)
- [ ] Voice command support
- [ ] WCAG 2.1 accessibility compliance

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, email support@onlinemedicose.com or open an issue on GitHub.

## 👨‍💻 Authors

- **Development Team** - Full stack development

## 🙏 Acknowledgments

- React and React Router communities
- Modern healthcare app design patterns
- All contributors and users

---

**Version**: 2.0.0  
**Release Date**: January 2026  
**Status**: Active Development  
**Next Release**: Q2 2026 (Backend Integration)

