package org.spring.loginregistration.service;

import org.spring.loginregistration.model.Admin;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserDoctorMapping;
import org.spring.loginregistration.repository.AdminRepository;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.UserDoctorMappingRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final UserDoctorMappingRepository userDoctorMappingRepository;

    public AdminService(AdminRepository adminRepository, JwtService jwtService, PasswordEncoder passwordEncoder, UserRepository userRepository, DoctorRepository doctorRepository, UserDoctorMappingRepository userDoctorMappingRepository){
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.userDoctorMappingRepository = userDoctorMappingRepository;
    }

    public void register(String userName, String email, String password){

        if (adminRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("Email already exists.");
        }

        String encodedPassword = passwordEncoder.encode(password);

        Admin admin = new Admin();
        admin.setUserName(userName);
        admin.setEmail(email);
        admin.setPassword(encodedPassword);
        adminRepository.save(admin);
    }

    public String login(String email, String password){
        Admin admin = adminRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("No email found."));

        boolean encodedPassword = passwordEncoder.matches(password, admin.getPassword());

        if(!encodedPassword){
            throw new RuntimeException("Password Incorrect.");
        }

        return jwtService.generateToken(admin.getAdminId(), "ADMIN");

    }

    public void assignDoctorToUser(Long userId, Long doctorId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("No doctor found"));
        if(userDoctorMappingRepository.existsByUser(user)){
            throw new RuntimeException("User already has a doctor assigned.");
        }

        UserDoctorMapping mapping = new UserDoctorMapping();
        mapping.setUser(user);
        mapping.setDoctor(doctor);
        userDoctorMappingRepository.save(mapping);
    }

}
