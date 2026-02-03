package org.spring.loginregistration.service;

import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorProfileRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserRepository userRepository, DoctorProfileRepository doctorProfileRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
    }


    public void addPrescription(List<String> medicines, String diagnoses, Date nextAppointmentDate, Long userId, Long doctorId, String notes) {
        Prescription prescription = new Prescription();

        prescription.setMedicines(medicines);
        prescription.setDiagnoses(diagnoses);
        prescription.setNote(notes);
        prescription.setNextAppointmentDate(nextAppointmentDate);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
        DoctorProfile doctorProfile = doctorProfileRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found."));
        prescription.setUser(user);
//        prescription.setDoctorProfile(doctorProfile);

        prescriptionRepository.save(prescription);
    }
}
