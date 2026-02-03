package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "doctor")
@Getter
@Setter
@Entity
public class DoctorProfile {
    @Id
    private Long id;
    private String degree;
    private String specialization;
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "doctor_id", unique = true)
    private Doctor doctor;
}
