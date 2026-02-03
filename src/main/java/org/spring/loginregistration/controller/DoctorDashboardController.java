package org.spring.loginregistration.controller;

import org.spring.loginregistration.dto.DoctorDashboardResponse;
import org.spring.loginregistration.dto.DoctorPatientData;
import org.spring.loginregistration.service.DoctorDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DoctorDashboardController {

    private final DoctorDashboardService doctorDashboardService;

    public DoctorDashboardController(DoctorDashboardService doctorDashboardService) {
        this.doctorDashboardService = doctorDashboardService;
    }

    @PostMapping("/doctorDashboard/{doctorId}")
    public ResponseEntity<DoctorDashboardResponse> setDoctorInfo(@PathVariable Long doctorId){
        return ResponseEntity.ok(doctorDashboardService.getInfo(doctorId));
    }


}
