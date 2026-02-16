package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.DoctorPatientData;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserProfile;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.UserProfileRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, JwtService jwtService, UserRepository userRepository, UserProfileRepository userProfileRepository){
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public String doctorRegistration(String userName, String email, String password){
        if (doctorRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("Email already exists.");
        }
        Doctor doctor = new Doctor();
        doctor.setUserName(userName);
        doctor.setEmail(email);
        doctor.setPassword(passwordEncoder.encode(password));
        doctorRepository.save(doctor);
        return "Doctor registered successfully.";
    }

    public String doctorLogin(String email, String password){
        Doctor doctor = doctorRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found."));
        if(!passwordEncoder.matches(password, doctor.getPassword())){
            throw new RuntimeException("Wrong password.");
        }
        return jwtService.generateToken(doctor.getDoctorId(), "DOCTOR");
    }

    public List<DoctorPatientData> getMyUsers(Long doctorId){
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        List<User> users = userRepository.findByDoctor(doctor);

        return users.stream().map(user -> {
            Optional<UserProfile> profileOpt = userProfileRepository.findByUser(user);
            if(profileOpt.isPresent()){
                UserProfile p = profileOpt.get();
                return new DoctorPatientData(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        p.getAge(),
                        p.getGender(),
                        p.getBloodGroup(),
                        p.getKnownDisease(),
                        p.getSymptoms(),
                        p.getAllergies(),
                        p.getNote(),
                        p.getProfilePhotoUrl() // Map photo URL
                );
            } else {
                return new DoctorPatientData(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        0, null, null, null, null, null, null, null
                );
            }
        }).collect(Collectors.toList());
    }
}
