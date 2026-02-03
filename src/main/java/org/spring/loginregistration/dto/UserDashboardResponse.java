package org.spring.loginregistration.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class UserDashboardResponse {
    private String username;
    private String diagnosis;
    private Date appointmentDate;
    private String doctorName;
    private String doctorDegree;
    private String specialization;
    private String doctorPhoneNumber;
    private List<String> medicines;
}
