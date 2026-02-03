package org.spring.loginregistration.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {
    int age;
    String gender;
    String bloodGroup;
    String knownDisease;
    String symptoms;
    String allergies;
}
