package org.spring.loginregistration.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final Map<String, String> otpStorage = new HashMap<>(); // Email -> OTP

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);
        sendEmail(email, otp);
        return otp;
    }

    private void sendEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}
