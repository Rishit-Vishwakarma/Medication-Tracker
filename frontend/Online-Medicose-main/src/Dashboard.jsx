import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState(null);
  const [medicationStatuses, setMedicationStatuses] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load user profile
  useEffect(() => {
    if (user && user.id) {
      try {
        const profileData = JSON.parse(localStorage.getItem(`profile_${user.id}`)) || {};
        setProfile(profileData);
        console.log('Profile loaded:', profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile({});
      }
    }
  }, [user]);

  // Save medication statuses to localStorage
  const saveMedicationStatuses = (statuses) => {
    if (user?.email) {
      localStorage.setItem(`medicationStatuses_${user.email}`, JSON.stringify(statuses));
    }
  };

  const todaysMedications = [
    { id: 1, name: "Paracetamol", time: "8:00 AM", dosage: "1 tablet", status: "taken", taken: true },
    { id: 2, name: "Amoxicillin", time: "1:00 PM", dosage: "2 tablets", status: "pending", taken: false },
    { id: 3, name: "Vitamins", time: "7:00 PM", dosage: "1 capsule", status: "pending", taken: false },
  ];

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: "Good Morning", icon: "☀️" };
    if (hour < 17) return { greeting: "Good Afternoon", icon: "☀️" };
    return { greeting: "Good Evening", icon: "🌙" };
  };

  const { greeting, icon } = getTimeBasedGreeting();

  // Calculate remaining medications and next dose
  const getRemainingMedications = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let remaining = 0;
    let nextDose = null;
    let nextDoseTime = null;

    todaysMedications.forEach(med => {
      const status = medicationStatuses[med.id] || med.status;
      if (status !== 'taken') {
        remaining++;
        // Parse medication time
        const [time, period] = med.time.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let medHour = hours;
        if (period === 'PM' && hours !== 12) medHour += 12;
        if (period === 'AM' && hours === 12) medHour = 0;

        const medTime = medHour * 60 + minutes;
        const currentTime = currentHour * 60 + currentMinute;

        if (medTime > currentTime && (!nextDoseTime || medTime < nextDoseTime)) {
          nextDoseTime = medTime;
          nextDose = med.time;
        }
      }
    });

    return { remaining, nextDose };
  };

  const { remaining, nextDose } = getRemainingMedications();

  // Calculate adherence rate
  const takenCount = todaysMedications.filter(med =>
    medicationStatuses[med.id] === 'taken' || med.taken
  ).length;
  const adherenceRate = Math.round((takenCount / todaysMedications.length) * 100);

  // Handle medication status change with micro-interactions
  const handleMedicationStatus = (medId, newStatus) => {
    const updatedStatuses = {
      ...medicationStatuses,
      [medId]: newStatus
    };
    setMedicationStatuses(updatedStatuses);
    saveMedicationStatuses(updatedStatuses);

    // Show toast notification
    setToastMessage("Medication marked as taken ✅");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Update streak if all medications are taken
    const allTaken = todaysMedications.every(med =>
      updatedStatuses[med.id] === 'taken' || med.taken
    );
    if (allTaken && takenCount === todaysMedications.length - 1) {
      setCurrentStreak(prev => prev + 1);
    }
  };

  // Check if all medications are completed
  const allMedicationsCompleted = todaysMedications.every(med =>
    medicationStatuses[med.id] === 'taken' || med.taken
  );

  // Get medication status for timeline
  const getMedicationStatus = (med) => {
    const status = medicationStatuses[med.id] || med.status;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Parse medication time
    const [time, period] = med.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let medHour = hours;
    if (period === 'PM' && hours !== 12) medHour += 12;
    if (period === 'AM' && hours === 12) medHour = 0;

    const medTime = medHour * 60 + minutes;
    const currentTime = currentHour * 60 + currentMinute;

    if (status === 'taken') return 'completed';
    if (Math.abs(currentTime - medTime) <= 30) return 'due'; // Within 30 minutes
    if (currentTime > medTime) return 'overdue';
    return 'upcoming';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopNavbar />

      <main className="dashboard-main">
        {!user ? (
          <div className="greeting-section">
            <h1>Loading...</h1>
            <p>Please wait while we load your dashboard</p>
          </div>
        ) : (
          <div className="greeting-section">
            <h1>{greeting}, {profile?.name || user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'} {icon}</h1>
            <p>Let’s get you started with your health journey</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
