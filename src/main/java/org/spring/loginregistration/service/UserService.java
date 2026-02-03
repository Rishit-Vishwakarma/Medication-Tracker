package org.spring.loginregistration.service;

import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorProfileRepository;
import org.spring.loginregistration.repository.PrescriptionRepository;
import org.spring.loginregistration.repository.UserDoctorMappingRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PrescriptionRepository prescriptionRepository;

    public UserService(UserRepository userRepository, DoctorProfileRepository doctorProfileRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PrescriptionRepository prescriptionRepository){
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.prescriptionRepository = prescriptionRepository;
    }

    public void registerUser(String userName, String email, String password){

        if(userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("Email already exits.");
        }

        String encodePassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(userName);
        user.setEmail(email);
        user.setPassword(encodePassword);

//        if (doctorId != null) {
//            DoctorProfile doctorProfile = doctorProfileRepository.findById(doctorId)
//                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
//            user.setDoctorProfile(doctorProfile);
//        }

        userRepository.save(user);
    }

    public String loginUser(String email, String password){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new RuntimeException("No email exist.");
        }

        User user = optionalUser.get();

        boolean isPasswordCorrect = passwordEncoder.matches(password, user.getPassword());

            if(!isPasswordCorrect){
                throw new RuntimeException("Password Incorrect");
            }

        return jwtService.generateToken(user.getId(), "USER");
    }

    public List<Prescription> getMyPrescriptions(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return prescriptionRepository.findByUser(user);
    }

}
