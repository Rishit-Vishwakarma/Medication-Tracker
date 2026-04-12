package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.*;
import org.spring.loginregistration.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Value("${groq.api.key}")
    private String API_KEY; 
    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    private final UserRepository userRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final PharmacyOrderRepository orderRepository;
    private final UserProfileRepository userProfileRepository;

    public AiController(UserRepository userRepository, PrescriptionRepository prescriptionRepository, 
                        AppointmentRepository appointmentRepository, PharmacyOrderRepository orderRepository,
                        UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.orderRepository = orderRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(Authentication authentication, @RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        

        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();
        Optional<UserProfile> profileOpt = userProfileRepository.findByUser(user);
        
        List<Prescription> prescriptions = prescriptionRepository.findByUserOrderByIdDesc(user);
        List<Appointment> appointments = appointmentRepository.findByUser(user);
        List<PharmacyOrder> orders = orderRepository.findByUserOrderByIdDesc(user);



        StringBuilder context = new StringBuilder();
        context.append("--- PATIENT PROFILE ---\n");
        context.append("Name: ").append(user.getUsername()).append("\n");
        context.append("Email: ").append(user.getEmail()).append("\n");
        
        if (profileOpt.isPresent()) {
            UserProfile p = profileOpt.get();
            context.append("Age: ").append(p.getAge()).append(", Gender: ").append(p.getGender()).append("\n");
            context.append("Blood Group: ").append(p.getBloodGroup()).append("\n");
            context.append("Known Diseases: ").append(p.getKnownDisease()).append("\n");
            context.append("Allergies: ").append(p.getAllergies()).append("\n");
            context.append("Current Symptoms: ").append(p.getSymptoms()).append("\n");
        }

        context.append("\n--- ASSIGNED DOCTOR ---\n");
        if (user.getDoctor() != null) {
            context.append("Doctor Name: Dr. ").append(user.getDoctor().getUserName()).append("\n");
            context.append("Doctor Email: ").append(user.getDoctor().getEmail()).append("\n");
        } else {
            context.append("No doctor assigned yet.\n");
        }

        context.append("\n--- PRESCRIPTIONS ---\n");
        if (!prescriptions.isEmpty()) {
            for (Prescription p : prescriptions) {
                context.append("Date: ").append(p.getDate()).append("\n");
                context.append("Diagnosis: ").append(p.getDiagnoses()).append("\n");
                context.append("Medicines: ").append(p.getMedicines()).append("\n");
                context.append("Doctor's Note: ").append(p.getNote()).append("\n");
                context.append("Next Follow-up: ").append(p.getNextAppointmentDate()).append("\n");
                context.append("----------------\n");
            }
        } else {
            context.append("No prescriptions found.\n");
        }
        
        context.append("\n--- APPOINTMENTS ---\n");
        if (!appointments.isEmpty()) {
            for (Appointment a : appointments) {
                context.append("Date: ").append(a.getAppointmentDate()).append(" at ").append(a.getAppointmentTime())
                       .append(" - Status: ").append(a.getStatus()).append("\n");
            }
        } else {
            context.append("No appointments scheduled.\n");
        }
        
        context.append("\n--- PHARMACY ORDERS ---\n");
        if (!orders.isEmpty()) {
            PharmacyOrder latest = orders.get(0);
            context.append("Latest Order Status: ").append(latest.getStatus())
                   .append(", Estimated Time: ").append(latest.getEstimatedTime())
                   .append(", Address: ").append(latest.getDeliveryAddress()).append("\n");
        } else {
            context.append("No orders placed.\n");
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile"); 
            
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a highly intelligent medical assistant for the MediCose app. " +
                                         "You have FULL access to the patient's dashboard data below. " +
                                         "Use this data to answer ANY question the patient asks about their health, doctor, medicines, or orders. " +
                                         "Be polite, professional, and concise.\n\n" + 
                                         "PATIENT DATA:\n" + context.toString());

            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);

            body.put("messages", List.of(systemMessage, userMsg));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + API_KEY);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, entity, Map.class);
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
                    String aiResponse = (String) messageMap.get("content");
                    
                    return ResponseEntity.ok(Collections.singletonMap("response", aiResponse));
                }
            }
            
            return ResponseEntity.ok(Collections.singletonMap("response", "I couldn't understand that."));

        } catch (HttpClientErrorException e) {
            System.err.println("❌ Groq API Error: " + e.getResponseBodyAsString());
            return ResponseEntity.ok(Collections.singletonMap("response", "AI Error: " + e.getStatusText()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Collections.singletonMap("response", "Internal Error: " + e.getMessage()));
        }
    }
}