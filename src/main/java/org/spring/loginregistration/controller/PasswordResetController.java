package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.UserRepository;
import org.spring.loginregistration.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/password-reset")
public class PasswordResetController {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetController(UserRepository userRepository, OtpService otpService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, String>> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            otpService.generateOtp(email);
            return ResponseEntity.ok(Collections.singletonMap("message", "OTP sent to your email."));
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email not found."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpService.verifyOtp(email, otp)) {
            return ResponseEntity.ok(Collections.singletonMap("message", "OTP verified."));
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Invalid OTP."));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (otpService.verifyOtp(email, otp)) {
            User user = userRepository.findByEmail(email).orElseThrow();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            otpService.clearOtp(email);
            return ResponseEntity.ok(Collections.singletonMap("message", "Password reset successful."));
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Session expired or invalid OTP."));
        }
    }
}
