package org.spring.loginregistration.controller;

import org.spring.loginregistration.dto.DoctorPatientData;
import org.spring.loginregistration.dto.PrescriptionRequest;
import org.spring.loginregistration.model.Appointment;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.repository.AppointmentRepository;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.service.DoctorService;
import org.spring.loginregistration.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionService prescriptionService;

    public DoctorController(DoctorService doctorService, DoctorRepository doctorRepository, 
                            UserRepository userRepository, AppointmentRepository appointmentRepository,
                            PrescriptionService prescriptionService) {
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/doctor/register")
    public String doctorRegister(@RequestBody Map<String, String> request){
         String userName = request.get("userName");
         String email = request.get("email");
         String password = request.get("password");
         return doctorService.doctorRegistration(userName, email, password);
    }

    @PostMapping("/doctor/login")
    public String doctorLogin(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String password = request.get("password");
        return "Login Successful. Token: " + doctorService.doctorLogin(email, password);
    }

    @GetMapping("/doctor/myUsers")
    public List<DoctorPatientData> getMyUsers(Authentication authentication){
        Long doctorId = (Long) authentication.getPrincipal();
        return doctorService.getMyUsers(doctorId);
    }

    @GetMapping("/doctor/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        Long doctorId = (Long) authentication.getPrincipal();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", userRepository.findByDoctor(doctor).size());
        
        List<Appointment> allAppts = appointmentRepository.findByDoctor(doctor);
        stats.put("totalAppointments", allAppts.size());
        stats.put("pendingAppointments", allAppts.stream().filter(a -> "PENDING".equals(a.getStatus())).count());
        stats.put("todayAppointments", allAppts.stream().filter(a -> LocalDate.now().equals(a.getAppointmentDate())).count());
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/doctor/prescription")
    public String writePrescription(@RequestBody PrescriptionRequest request, Authentication authentication){
        Long doctorId = (Long) authentication.getPrincipal();

        prescriptionService.savePrescription(
                doctorId,
                request.getUserId(),
                request.getMedicines(),
                request.getDiagnosis(),
                request.getNote(),
                request.getNextAppointmentDate()
        );

        return "Prescription sent successfully!";
    }
}
