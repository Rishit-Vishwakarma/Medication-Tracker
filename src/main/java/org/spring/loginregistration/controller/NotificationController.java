package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.Notification;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(notificationService.getMyNotifications(user));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<String> markRead(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok("Marked as read");
    }
}
