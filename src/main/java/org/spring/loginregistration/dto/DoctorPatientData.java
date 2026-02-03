package org.spring.loginregistration.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DoctorPatientData {
    private String userName;
    private String email;
    private String gender;
    private String Symptoms;
    private int age;
}
