package org.spring.loginregistration.controller;

import org.spring.loginregistration.dto.DoctorProfileResponse;
import org.spring.loginregistration.service.DoctorProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
public class DoctorProfileController {

    private final DoctorProfileService doctorProfileService;
    public DoctorProfileController(DoctorProfileService doctorProfileService){
        this.doctorProfileService = doctorProfileService;
    }

    @PostMapping("/doctor/SetProfile")
    public ResponseEntity<String> setDoctorInfo(@RequestParam String degree, @RequestParam String specialization, @RequestParam String phoneNumber, Authentication authentication){
        Long doctorId = (Long)authentication.getPrincipal();
        doctorProfileService.setDoctorInfo( doctorId, degree, specialization, phoneNumber);
        return ResponseEntity.ok("Doctor Info saved successfully. ");
    }

    @GetMapping("/doctor/GetProfile")
    public ResponseEntity<DoctorProfileResponse> getDoctorInfo(Authentication authentication){
        Long doctorId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(doctorProfileService.getDoctorInfo(doctorId));
    }

    @PutMapping("doctor/prescription")
    public ResponseEntity<String> editPriscription(@RequestParam List<String> medicines, @RequestParam String diagnoses, @RequestParam Date nextAppointmentDate, Authentication authentication){
        Long userId = (Long) authentication.getPrincipal();
        doctorProfileService.setPrescription( userId, medicines, diagnoses, nextAppointmentDate);
        return ResponseEntity.ok("Prescription updated successfully");
    }
}