package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.DoctorProfileResponse;
import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorProfileRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorProfileService {
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PrescriptionRepository prescriptionRepository;

    public DoctorProfileService(DoctorProfileRepository doctorProfileRepository, PrescriptionRepository prescriptionRepository, UserRepository userRepository){
        this.doctorProfileRepository = doctorProfileRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
    }

    public void setDoctorInfo(Long doctorId, String degree, String specialization, String phoneNumber){

        DoctorProfile doctorProfile = doctorProfileRepository.findById(doctorId)
                .orElse(new DoctorProfile());

        doctorProfile.setId(doctorId);
        doctorProfile.setDegree(degree);
        doctorProfile.setSpecialization(specialization);
        doctorProfile.setPhoneNumber(phoneNumber);

        doctorProfileRepository.save(doctorProfile);
    }

    public DoctorProfileResponse getDoctorInfo(Long doctorId){
        DoctorProfile doctorProfile = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("No Doctor Profile found."));

        DoctorProfileResponse response = new DoctorProfileResponse();
        response.setDegree(doctorProfile.getDegree());
        response.setSpecialization(doctorProfile.getSpecialization());
        response.setPhoneNumber(doctorProfile.getPhoneNumber());

        return response;
    }

    public void setPrescription(Long userId, List<String> medicines, String diagnoses, Date nextAppointmentDate){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Prescription> prescription = prescriptionRepository.findTopByUserOrderByIdDesc(user);
        if (prescription.isEmpty()){
            throw new RuntimeException("No Prescription found for this user.");
        }

        Prescription prescription1 = prescription.get();
        prescription1.setMedicines(medicines);
        prescription1.setDiagnoses(diagnoses);
        prescription1.setNextAppointmentDate(nextAppointmentDate);
        prescriptionRepository.save(prescription1);
    }
}
