package org.spring.loginregistration.controller;

import org.spring.loginregistration.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/admin/register")
    public ResponseEntity<String> registerAdmin(@RequestParam String username, @RequestParam String email, @RequestParam String password){
        adminService.register(username, email, password);
        return ResponseEntity.ok("Admin Register Successfully.");
    }

    @PostMapping("/admin/login")
    public ResponseEntity<String> loginAdmin(@RequestParam String email, @RequestParam String password){
        String msg = adminService.login(email, password);
        return ResponseEntity.ok("Admin Login successfully. Token: " + msg);
    }

    @PostMapping("/admin/assignDoctorToUser")
    public ResponseEntity<String> assignDoctor(Authentication authentication, @RequestParam Long userId, @RequestParam Long doctorId){
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing token");
        }
        adminService.assignDoctorToUser(userId, doctorId);
        return ResponseEntity.ok("Doctor assigned successfully.");
    }
}
