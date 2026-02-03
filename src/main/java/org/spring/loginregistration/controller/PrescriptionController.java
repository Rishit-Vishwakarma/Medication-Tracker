package org.spring.loginregistration.controller;


import org.spring.loginregistration.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/prescription")
    public ResponseEntity<String> addPrescription(@RequestParam List<String> medicines, @RequestParam String diagnoses, @RequestParam Date nextAppointmentDate, @RequestParam Long userId, @RequestParam Long doctorId, @RequestParam String notes){
        prescriptionService.addPrescription(medicines, diagnoses, nextAppointmentDate, userId, doctorId, notes);
        return ResponseEntity.ok("Prescription added successfully.");
    }
}
