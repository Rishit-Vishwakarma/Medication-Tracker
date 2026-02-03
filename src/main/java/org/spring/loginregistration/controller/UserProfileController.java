package org.spring.loginregistration.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.spring.loginregistration.dto.UserProfileResponse;
import org.spring.loginregistration.security.JwtService;
import org.spring.loginregistration.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final JwtService jwtService;
    public UserProfileController(UserProfileService userProfileService, JwtService jwtService){
        this.userProfileService = userProfileService;
        this.jwtService = jwtService;
    }

    @GetMapping("/User/profile")
    public ResponseEntity<UserProfileResponse> getInfo(HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long)authentication.getPrincipal();

        return ResponseEntity.ok(userProfileService.gettingInfo(userId));

    }

    @PostMapping("/User/profile")
    public  ResponseEntity<?>setInfo(Authentication authentication ,@RequestBody UserProfileResponse userProfileResponse){
        Long userId = (Long) authentication.getPrincipal();
        userProfileService.settingInfo(userId, userProfileResponse);

        return ResponseEntity.ok("Profile created.");
    }

    @PutMapping("/User/profile")
    public void editInfo(Authentication authentication, @RequestBody UserProfileResponse userProfileResponse){
        Long userId = (Long) authentication.getPrincipal();
        userProfileService.updateInfo(userId, userProfileResponse);
    }

    @GetMapping("/doctor/profile/{doctorId}")
    public ResponseEntity<UserProfileResponse> getInfoDoctor(@PathVariable Long doctorId){
        return ResponseEntity.ok(userProfileService.gettingInfo(doctorId));
    }

}
