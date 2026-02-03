package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.UserDashboardResponse;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.repository.DoctorProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDashboardService {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;

    public UserDashboardService(UserRepository userRepository, DoctorProfileRepository doctorProfileRepository, PrescriptionRepository prescriptionRepository, DoctorRepository doctorRepository){
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.doctorRepository = doctorRepository;
    }

    public UserDashboardResponse giveInfo(Long UserId){
        UserDashboardResponse response = new UserDashboardResponse();
        Optional<User> optionalUser = userRepository.findById(UserId);


        if(optionalUser.isEmpty()){
            throw new RuntimeException("User not found.");
        }
            User user = optionalUser.get();
            Doctor doctor = user.getDoctor();

            if (doctor == null){
                throw new RuntimeException("No Doctor Exist for this patient.");
            }
            Optional<DoctorProfile> optionalDoctor = doctorProfileRepository.findById(doctor.getDoctorId());
            if (optionalDoctor.isEmpty()){
                throw new RuntimeException("Doctor not found.");
            }
        Optional<Prescription> optionalPrescription = prescriptionRepository.
                findTopByUserOrderByIdDesc(user);
            if (optionalPrescription.isEmpty()){
                throw new RuntimeException("Prescription not found.");
            }

            DoctorProfile doctorProfile = optionalDoctor.get();
            Prescription prescription = optionalPrescription.get();


            response.setUsername(user.getUsername());
            response.setDoctorDegree(doctorProfile.getDegree());
            response.setSpecialization(doctorProfile.getSpecialization());
            response.setDoctorPhoneNumber(doctorProfile.getPhoneNumber());
            response.setAppointmentDate(prescription.getNextAppointmentDate());
            response.setDiagnosis(prescription.getDiagnoses());
            response.setMedicines(prescription.getMedicines());
            return response;




    }
}
