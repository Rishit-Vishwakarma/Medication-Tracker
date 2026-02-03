package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.DoctorDashboardResponse;
import org.spring.loginregistration.dto.DoctorPatientData;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DoctorDashboardService {
    private final DoctorRepository doctorRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;

    public DoctorDashboardService(DoctorRepository doctorRepository, PrescriptionRepository prescriptionRepository, UserRepository userRepository){
        this.doctorRepository = doctorRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
    }

    public DoctorDashboardResponse getInfo(Long doctorId){
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found."));

        User user = userRepository.findTopByDoctorOrderByIdDesc(doctor)
                .orElseThrow(() -> new RuntimeException("No User found for this doctor."));

        Prescription prescription = prescriptionRepository.findTopByUserOrderByIdDesc(user)
                .orElseThrow(() -> new RuntimeException("No Prescription found for this patient."));

        DoctorDashboardResponse response = new DoctorDashboardResponse();
        response.setDiagnosis(prescription.getDiagnoses());
        response.setPatientName(user.getUsername());
        response.setMedicines(prescription.getMedicines());
        response.setNextAppointmentDate(prescription.getNextAppointmentDate());

        return response;
    }

}
