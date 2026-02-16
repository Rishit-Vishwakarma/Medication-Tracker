package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.repository.DoctorProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor")
public class DoctorProfileController {

    private final DoctorProfileRepository doctorProfileRepository;

    public DoctorProfileController(DoctorProfileRepository doctorProfileRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<DoctorProfile> saveProfile(Authentication authentication, @RequestBody DoctorProfile profile) {
        Long doctorId = (Long) authentication.getPrincipal();
        profile.setId(doctorId);
        return ResponseEntity.ok(doctorProfileRepository.save(profile));
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorProfile> getMyProfile(Authentication authentication) {
        Long doctorId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(doctorProfileRepository.findById(doctorId).orElse(new DoctorProfile()));
    }

    @GetMapping("/profile-by-id/{id}")
    public ResponseEntity<DoctorProfile> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorProfileRepository.findById(id).orElse(new DoctorProfile()));
    }
}
