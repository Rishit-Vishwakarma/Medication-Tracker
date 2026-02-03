package org.spring.loginregistration.controller;

import org.spring.loginregistration.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String username, @RequestParam String email, @RequestParam String password){
        userService.registerUser(username, email, password);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestParam String email, @RequestParam String password){
        String msg = userService.loginUser(email, password);
        return ResponseEntity.ok("Login Successful. Token:  " + msg);
    }

}
