package org.spring.loginregistration.service;

import org.spring.loginregistration.model.Appointment;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.AppointmentRepository;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository, 
                              DoctorRepository doctorRepository, NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.notificationService = notificationService;
    }

    public Appointment bookAppointment(Long userId, LocalDate date, LocalTime time, String reason) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getDoctor() == null) throw new RuntimeException("No doctor assigned.");

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(user.getDoctor());
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setReason(reason);
        appointment.setStatus("PENDING");

        Appointment saved = appointmentRepository.save(appointment);
        
        // Notify Patient
        notificationService.createNotification(user, "Appointment request sent to Dr. " + user.getDoctor().getUserName());
        
        // Notify Doctor ✅
        notificationService.createDoctorNotification(user.getDoctor(), "New appointment request from " + user.getUsername() + " for " + date);
        
        return saved;
    }

    public List<Appointment> getPatientAppointments(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return appointmentRepository.findByUserOrderByIdDesc(user);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        return appointmentRepository.findByDoctorOrderByIdDesc(doctor);
    }

    public Appointment updateStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        appointment.setStatus(status);
        
        // Notify Patient
        notificationService.createNotification(appointment.getUser(), 
            "Your appointment on " + appointment.getAppointmentDate() + " is now " + status);

        return appointmentRepository.save(appointment);
    }
}
