package org.spring.loginregistration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorPatientData {
    private Long id;
    private String userName;
    private String email;
    private int age;
    private String gender;
    private String bloodGroup;
    private String knownDisease;
    private String symptoms;
    private String allergies;
    private String note;
    private String profilePhotoUrl; // Added field
}
