# Online Medicose - Architecture & Implementation Guide

## Project Architecture Overview

```
Online Medicose (React Application)
├── Authentication Layer
│   ├── Login Component
│   └── Signup Component
├── Core Features
│   ├── Home (Landing Page)
│   ├── Profile (User Management)
│   ├── Medications (Medication Tracking)
│   └── Appointments (Appointment Scheduling)
├── Advanced Features (v2.0)
│   ├── NotificationCenter (Notifications)
│   ├── HealthAnalytics (Analytics & Charts)
│   ├── DoctorDashboard (Doctor Interface)
│   ├── PrescriptionManager (Prescription Handling)
│   ├── VideoConsultation (Video Calls)
│   └── MedicationRefill (Refill System)
└── Infrastructure
    ├── React Router (Navigation)
    ├── React Hooks (State Management)
    └── CSS3 (Styling)
```

## Component Hierarchy & Data Flow

### Application Root (App.js)
```
App (Router)
├── Home Route (/)
├── Login Route (/login)
├── Signup Route (/signup)
├── Profile Route (/profile)
├── Medications Route (/medications)
├── Appointments Route (/appointments)
├── NotificationCenter Route (/notifications)
├── HealthAnalytics Route (/health-analytics)
├── DoctorDashboard Route (/doctorProfile-dashboard)
├── PrescriptionManager Route (/prescriptions)
├── VideoConsultation Route (/video-consultation)
└── MedicationRefill Route (/medication-refill)
```

## State Management Strategy

### Current Implementation (Local State with Hooks)
All components use React's `useState` hook for state management:

```javascript
// Example Pattern Used Across Components
const [items, setItems] = useState(initialData);
const [selectedItem, setSelectedItem] = useState(null);
const [formData, setFormData] = useState({});
const [filter, setFilter] = useState('all');

// CRUD Operations
const handleAdd = (newItem) => {
  setItems([newItem, ...items]);
};

const handleDelete = (id) => {
  setItems(items.filter(item => item.id !== id));
};

const handleUpdate = (id, updatedItem) => {
  setItems(items.map(item => item.id === id ? updatedItem : item));
};
```

### Migration Path to Advanced State Management

**Phase 3 (Future)**: Migrate to Context API or Redux for:
- Global authentication state
- User data persistence
- Cross-component data sharing
- Complex state interactions

## Component Specifications

### 1. Authentication Components

#### Login.jsx
```javascript
State:
- email: string
- password: string
- error: string
- loading: boolean

Methods:
- handleInputChange(event)
- handleLogin(event)

Features:
- Email validation
- Password validation
- Error handling
- Link to signup
```

#### Signup.jsx
```javascript
State:
- formData: {name, email, password, confirmPassword}
- errors: {field: error}
- loading: boolean

Methods:
- validatePassword(password)
- checkPasswordStrength(password)
- handleInputChange(event)
- handleSignup(event)

Features:
- Password strength indicator
- Confirm password match
- Form validation
- Error messages
```

### 2. Core Feature Components

#### Home.jsx
```javascript
Content Sections:
- Header with navigation
- Hero section
- Features grid (6 features)
- User types section (3 types)
- How it works (4 steps)
- Benefits list
- CTA section
- Footer

Navigation Links:
- All routes accessible from navigation bar
```

#### Profile.jsx
```javascript
State:
- userInfo: {name, email, phone, dob}
- healthInfo: {bloodGroup, height, weight}
- emergencyContact: {name, relation, phone}
- documents: []
- caretakers: []
- profilePhoto: file
- selectedTab: string

Sections:
1. Profile Photo Upload
2. Basic Information
3. Health Information
4. Emergency Contact
5. Documents
6. Caretakers Management
7. Settings & Feedback
```

#### Medications.jsx
```javascript
State:
- medications: array
- selectedMedication: object
- showForm: boolean
- searchTerm: string
- filterStatus: string
- newMedication: {name, dosage, frequency, startDate, endDate, notes}

Features:
- Add medications
- Edit medications
- Delete medications
- Set reminders
- Track adherence
- Schedule view
- History tracking

Dose Status:
- Taken ✓
- Snooze ⏭️
- Skip ✕
```

#### Appointments.jsx
```javascript
State:
- appointments: array
- showForm: boolean
- selectedDate: date
- currentMonth: number
- currentYear: number
- userRole: 'patient' | 'doctorProfile' | 'caretaker'
- newAppointment: {patientName, doctorName, date, time, reason, notes}

Calendar Features:
- getDaysInMonth(month, year)
- navigateMonth(direction)
- isToday(date)
- Date selection
- Multi-role view

Views:
- Calendar view
- Appointment list
- Appointment details
```

### 3. Advanced Feature Components (New)

#### NotificationCenter.jsx
```javascript
State:
- notifications: [{id, type, title, message, timestamp, read}]
- filterType: 'all' | 'appointment' | 'medication' | 'health' | 'prescription'

Methods:
- markAsRead(id)
- markAllAsRead()
- deleteNotification(id)
- getFilteredNotifications()
- getNotificationIcon(type)
- formatTime(timestamp)

Notification Types:
- appointment (Blue) 📅
- medication (Green) 💊
- health (Orange) ❤️
- prescription (Purple) 📋

Features:
- Unread badge count
- Type filtering
- Read/unread toggling
- Individual delete
- Mark all as read
- Time formatting
```

#### HealthAnalytics.jsx
```javascript
State:
- timeRange: 'week' | 'month' | 'year'
- adherenceData: {week: [], month: [], year: []}

Methods:
- getLabels(timeRange)
- getCurrentData(timeRange)
- getMedicationStats()
- getHealthTrends()
- exportReport()
- shareData()

Sections:
1. Time Range Selector
2. Adherence Chart (Bar chart)
3. Medication Performance (Progress bars)
4. Health Metrics (4 metric cards)
5. Health Insights (4 insight cards)
6. Summary Statistics

Chart Data:
- Days: 0-100 scale
- Colors: Red (≤50), Yellow (50-80), Green (>80)
```

#### DoctorDashboard.jsx
```javascript
State:
- selectedTab: 'overview' | 'patients' | 'appointments' | 'reports'
- patients: []
- appointments: []
- selectedPatient: object
- showModal: boolean

Tabs:
1. Overview
   - Stats cards (4)
   - Recent activity list

2. Patients
   - Patient table
   - Sortable columns
   - Adherence bar
   - Status badge
   - Modal with details

3. Appointments
   - Today's appointments
   - Patient details
   - Action buttons

4. Reports
   - Report types
   - Generate options

Methods:
- getAdherenceColor(value)
- getStatusColor(status)
```

#### PrescriptionManager.jsx
```javascript
State:
- prescriptions: []
- showForm: boolean
- selectedPrescription: object
- uploadData: {medicineName, strength, dosage, duration, prescribedDate, expiryDate, doctorProfile, notes, image}
- searchTerm: string
- filterStatus: 'all' | 'active' | 'expiring'

Methods:
- handleAddPrescription(event)
- handleDeletePrescription(id)
- getStatusColor(status)
- isExpiringSoon(date)
- isExpired(date)

Status Badges:
- Active (Green) ✓
- Expiring Soon (Yellow) 🟡
- Expired (Red) ❌

Features:
- Upload prescriptions
- Search functionality
- Status filtering
- Expiry tracking
- Refill requests
- Share with doctorProfile
- OCR placeholder
```

#### VideoConsultation.jsx
```javascript
State:
- consultations: [{id, doctorName, specialization, date, time, status, notes, doctorImage, rating}]
- selectedConsultation: object
- showScheduleForm: boolean
- formData: {doctorName, specialization, date, time, notes}
- availableDoctors: []

Methods:
- handleScheduleConsultation(event)
- handleStartConsultation(consultation)
- handleEndConsultation()
- handleCancelConsultation(id)
- getStatusColor(status)

Sections:
1. Schedule Form
2. Upcoming Consultations
3. Consultation History
4. How It Works (4 steps)
5. Features Grid (6 features)

Video Call Features:
- Placeholder video
- Call controls (Mute, Video, Screen Share, End)
- Call timer
- Live chat
- Message history
```

#### MedicationRefill.jsx
```javascript
State:
- refillRequests: []
- medications: []
- showRefillForm: boolean
- selectedMedication: object
- formData: {medicationId, quantity, pharmacyId, notes}
- pharmacies: [{id, name, rating, deliveryTime, distance}]

Methods:
- handleRequestRefill(event)
- handleCancelRefill(id)
- handleAutoRefill(medicationId)
- getStatusColor(status)
- getStatusLabel(status)
- isLowStock(quantity)
- isRunningOut(quantity)

Status Indicators:
- Pending (Amber) 🔄
- Approved (Blue) ✓
- Delivered (Green) 📦
- Cancelled (Red) ✕

Stock Levels:
- Critical: ≤5 units (Red alert)
- Low: ≤10 units (Yellow alert)
- Adequate: >10 units (Green)

Sections:
1. Quick Actions Bar
2. Refill Request Form
3. Stock Status Grid
4. Refill Requests History
5. Available Pharmacies
6. Auto-Refill Setup
7. Helpful Tips
```

## Styling Architecture

### CSS Organization

```
Global Styles (index.css)
├── Root Colors
├── Typography
├── Reset/Normalize

Component Styles
├── Layout Components
│   ├── Header styling
│   ├── Navigation
│   └── Footer
├── Feature Components
│   ├── Cards
│   ├── Forms
│   └── Tables
└── Utility Classes
    ├── Buttons
    ├── Badges
    ├── Alerts
    └── Responsive classes
```

### Color Scheme

```
Primary: #667eea (Purple)
Secondary: #764ba2 (Darker Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
Info: #3b82f6 (Blue)
Neutral: #e5e7eb (Light Gray)
Text: #333333 (Dark Gray)
Background: #ffffff (White)
```

### Responsive Breakpoints

```
Mobile: < 480px
Tablet: 480px - 768px
Desktop: > 768px
Large: > 1024px

Media Query Pattern:
@media (max-width: 768px) {
  /* Tablet & Mobile styles */
}
```

## Data Flow Patterns

### Add Operation
```javascript
const handleAdd = (newItem) => {
  const item = {
    id: Date.now(),
    ...newItem,
    createdAt: new Date()
  };
  setItems([item, ...items]);
};
```

### Edit Operation
```javascript
const handleEdit = (id, updatedData) => {
  setItems(items.map(item =>
    item.id === id ? { ...item, ...updatedData } : item
  ));
};
```

### Delete Operation
```javascript
const handleDelete = (id) => {
  setItems(items.filter(item => item.id !== id));
};
```

### Search & Filter Pattern
```javascript
const filteredItems = items.filter(item =>
  (item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
  (filterStatus === 'all' || item.status === filterStatus)
);
```

## Form Handling Pattern

```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  field3: ''
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Validate
  if (validateForm(formData)) {
    // Submit
    handleAction(formData);
    // Reset
    setFormData({ field1: '', field2: '', field3: '' });
  }
};
```

## Performance Optimizations

### Current Optimizations
- CSS animations instead of JS animations
- Minimal re-renders with proper state structure
- Lazy loading for images
- CSS Grid and Flexbox for efficient layouts

### Future Optimizations
- React.memo for component memoization
- useCallback for function memoization
- Code splitting with React.lazy
- Image optimization with lazy loading
- Service worker for PWA

## Future Migration Paths

### To Redux
```javascript
// Single source of truth
const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationsReducer,
    appointments: appointmentsReducer,
    notifications: notificationsReducer,
    doctorProfile: doctorReducer,
    prescriptions: prescriptionsReducer,
    refills: refillsReducer
  }
});
```

### To TypeScript
```typescript
interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface MedicationsState {
  medications: Medication[];
  loading: boolean;
  error: string | null;
}
```

### To Backend API
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Medications API
export const medicationsAPI = {
  getAll: () => axios.get(`${API_BASE}/medications`),
  getById: (id) => axios.get(`${API_BASE}/medications/${id}`),
  create: (data) => axios.post(`${API_BASE}/medications`, data),
  update: (id, data) => axios.put(`${API_BASE}/medications/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/medications/${id}`)
};
```

## Testing Strategy

### Unit Tests (Jest)
- Component rendering
- Event handlers
- Conditional rendering
- State updates

### Integration Tests
- Form submissions
- Navigation flow
- Data operations
- User workflows

### E2E Tests (Cypress)
- Complete user journeys
- Multi-step workflows
- Cross-browser compatibility

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build optimized and tested
- [ ] All routes working
- [ ] Form validations working
- [ ] Responsive design verified
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Analytics integration (if needed)

## Documentation Structure

```
documentation/
├── README.md (Overview)
├── QUICKSTART.md (Getting started)
├── FEATURES.md (Feature list)
├── ARCHITECTURE.md (This file)
├── API_REFERENCE.md (API docs - future)
├── DEPLOYMENT.md (Deployment guide)
├── TROUBLESHOOTING.md (Common issues)
└── CONTRIBUTING.md (Contribution guide)
```

---

**Version**: 2.0.0  
**Architecture**: Component-based with Local State  
**Target**: Production-ready with v2.0.0 release  
**Next Version**: 3.0.0 (Backend + TypeScript)
