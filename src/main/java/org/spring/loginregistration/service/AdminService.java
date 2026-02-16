package org.spring.loginregistration.service;

import org.spring.loginregistration.dto.DoctorDTO;
import org.spring.loginregistration.dto.UserDTO;
import org.spring.loginregistration.model.*;
import org.spring.loginregistration.repository.*;
import org.spring.loginregistration.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PharmacyOrderRepository orderRepository;
    private final NotificationService notificationService;
    private final UserProfileRepository userProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    public AdminService(AdminRepository adminRepository, JwtService jwtService, PasswordEncoder passwordEncoder, 
                        UserRepository userRepository, DoctorRepository doctorRepository, 
                        AppointmentRepository appointmentRepository, PharmacyOrderRepository orderRepository,
                        NotificationService notificationService, UserProfileRepository userProfileRepository,
                        DoctorProfileRepository doctorProfileRepository){
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
        this.userProfileRepository = userProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
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
        if(!passwordEncoder.matches(password, admin.getPassword())){
            throw new RuntimeException("Password Incorrect.");
        }
        return jwtService.generateToken(admin.getAdminId(), "ADMIN");
    }

    public void assignDoctorToUser(Long userId, Long doctorId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("No doctor found"));
        
        if (user.getDoctor() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This patient already has a doctor assigned: " + user.getDoctor().getUserName());
        }

        user.setDoctor(doctor);
        userRepository.save(user);
        
        notificationService.createNotification(user, "Dr. " + doctor.getUserName() + " has been assigned as your primary doctor.");
        notificationService.createDoctorNotification(doctor, "New patient assigned: " + user.getUsername());
    }

    public List<UserDTO> getAllUsers() {
        try {
            return userRepository.findAll().stream()
                    .map(u -> {
                        Optional<UserProfile> profile = userProfileRepository.findByUser(u);
                        return new UserDTO(
                            u.getId(), 
                            u.getUsername(), 
                            u.getEmail(),
                            u.getDoctor() != null ? u.getDoctor().getUserName() : null,
                            profile.isPresent() ? profile.get().getSymptoms() : "Not set",
                            profile.isPresent() ? profile.get().getKnownDisease() : "None"
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("❌ Error in getAllUsers: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<DoctorDTO> getAllDoctors() {
        try {
            return doctorRepository.findAll().stream()
                    .map(d -> {
                        Optional<DoctorProfile> profile = doctorProfileRepository.findById(d.getDoctorId());
                        return new DoctorDTO(
                            d.getDoctorId(), 
                            d.getUserName(), 
                            d.getEmail(),
                            profile.isPresent() ? profile.get().getSpecialization() : "General Physician",
                            profile.isPresent() ? profile.get().getDegreeName() : "MBBS"
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("❌ Error in getAllDoctors: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public void removeDoctorFromUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found"));
        user.setDoctor(null);
        userRepository.save(user);
    }

    public List<Doctor> getDoctorsWithPatients() {
        return doctorRepository.findAll();
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Map<String, Long> getAnalytics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPatients", userRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalOrders", orderRepository.count());
        return stats;
    }
}
