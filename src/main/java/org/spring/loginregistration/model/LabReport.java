package org.spring.loginregistration.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class LabReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName; // Original filename
    private String reportName; // User provided name
    private String fileUrl;
    private LocalDate reportDate; // Date of the report
    private LocalDate uploadDate; // Date of upload

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDate.now();
    }
}
