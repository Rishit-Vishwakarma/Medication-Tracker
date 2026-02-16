package org.spring.loginregistration.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>(); // Email -> OTP

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);
        
        // PRINT TO CONSOLE FOR TESTING
        System.out.println("************************************************");
        System.out.println("🔑 OTP for " + email + " is: " + otp);
        System.out.println("************************************************");
        
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}
