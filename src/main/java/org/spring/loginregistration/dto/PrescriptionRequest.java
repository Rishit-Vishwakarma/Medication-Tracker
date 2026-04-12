package org.spring.loginregistration.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PrescriptionRequest {
    private Long userId;
    private List<String> medicines;
    private String diagnosis;
    private String note;
    private LocalDate nextAppointmentDate;
}
