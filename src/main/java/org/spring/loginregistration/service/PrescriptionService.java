package org.spring.loginregistration.service;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService; // Added

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserRepository userRepository, 
                               DoctorRepository doctorRepository, NotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.notificationService = notificationService;
    }

    public Prescription savePrescription(Long doctorId, Long patientId, List<String> medicines, String diagnoses, String note, LocalDate nextDate) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setUser(user);
        prescription.setMedicines(medicines);
        prescription.setDiagnoses(diagnoses);
        prescription.setNote(note);
        prescription.setNextAppointmentDate(nextDate);

        Prescription saved = prescriptionRepository.save(prescription);
        
        // Notify Patient
        notificationService.createNotification(user, "Dr. " + doctor.getUserName() + " has sent you a new prescription for " + diagnoses);
        
        return saved;
    }

    public List<Prescription> getPrescriptionsForPatient(Long patientId) {
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return prescriptionRepository.findByUserOrderByIdDesc(user);
    }
}
