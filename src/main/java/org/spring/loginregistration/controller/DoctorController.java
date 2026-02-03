package org.spring.loginregistration.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.spring.loginregistration.dto.DoctorPatientData;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.security.JwtService;
import org.spring.loginregistration.service.DoctorService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DoctorController {

    private final DoctorService doctorService;
    private final JwtService jwtService;

    public DoctorController(DoctorService doctorService, JwtService jwtService){
        this.doctorService = doctorService;
        this.jwtService = jwtService;
    }

    @PostMapping("/doctor/register")
    public String doctorRegister(@RequestParam String userName, @RequestParam String email, @RequestParam String password){

         return doctorService.doctorRegistration(userName, email, password);
    }

    @PostMapping("/doctor/login")
    public String doctorLogin(@RequestParam String email, @RequestParam String password){
        return "Login Successful.  Token:  " + doctorService.doctorLogin(email, password);
    }

    @GetMapping("doctor/myUsers")
    public List<DoctorPatientData> getMyUsers(Authentication authentication){
        Long doctorId = (Long) authentication.getPrincipal();
        return doctorService.getMyUsers(doctorId);
    }
}
