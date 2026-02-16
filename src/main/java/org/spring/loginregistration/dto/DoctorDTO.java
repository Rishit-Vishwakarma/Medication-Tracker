package org.spring.loginregistration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO {
    private Long doctorId;
    private String userName;
    private String email;
    private String specialization; // Added
    private String degreeName; // Added
}
