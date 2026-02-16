package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.LabReport;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.LabReportRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
public class LabReportController {

    private final LabReportRepository reportRepository;
    private final UserRepository userRepository;
    private final Path fileStorageLocation;

    public LabReportController(LabReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.fileStorageLocation = Paths.get("uploads/reports").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory.", ex);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<LabReport> uploadReport(Authentication authentication, @RequestParam("file") MultipartFile file) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "http://localhost:8080/files/view/reports/" + fileName;

            LabReport report = new LabReport();
            report.setFileName(file.getOriginalFilename());
            report.setFileUrl(fileUrl);
            report.setUser(user);
            
            return ResponseEntity.ok(reportRepository.save(report));
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file.", ex);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<LabReport>> getMyReports(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(reportRepository.findByUserOrderByUploadDateDesc(user));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LabReport>> getUserReports(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(reportRepository.findByUserOrderByUploadDateDesc(user));
    }
}
