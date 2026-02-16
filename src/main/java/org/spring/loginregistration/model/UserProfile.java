package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    int age;
    String gender;
    String bloodGroup;
    String knownDisease;
    String symptoms;
    String allergies;
    String note;
    String profilePhotoUrl; // Added photo field

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
