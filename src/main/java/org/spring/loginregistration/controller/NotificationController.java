package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.Notification;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.DoctorRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository, DoctorRepository doctorRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        Long id = (Long) authentication.getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        
        System.out.println("🔔 Fetching notifications for ID: " + id + " with Role: " + role);

        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findById(id).orElseThrow();
            return ResponseEntity.ok(notificationService.getDoctorNotifications(doctor));
        } else {
            User user = userRepository.findById(id).orElseThrow();
            return ResponseEntity.ok(notificationService.getMyNotifications(user));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        Long id = (Long) authentication.getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findById(id).orElseThrow();
            return ResponseEntity.ok(notificationService.getDoctorUnreadCount(doctor));
        } else {
            User user = userRepository.findById(id).orElseThrow();
            return ResponseEntity.ok(notificationService.getUnreadCount(user));
        }
    }

    @PostMapping("/mark-read")
    public ResponseEntity<String> markRead(Authentication authentication) {
        Long id = (Long) authentication.getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findById(id).orElseThrow();
            notificationService.markDoctorAllAsRead(doctor);
        } else {
            User user = userRepository.findById(id).orElseThrow();
            notificationService.markAllAsRead(user);
        }
        return ResponseEntity.ok("Marked as read");
    }
}
