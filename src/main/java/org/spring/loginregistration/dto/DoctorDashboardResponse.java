package org.spring.loginregistration.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class DoctorDashboardResponse {
    private String patientName;
    private String diagnosis;
    private List<String> medicines;
    private Date nextAppointmentDate;
}
