package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long adminId;

    String userName;
    String email;
    String password;

    @OneToMany
    @JoinColumn(name = "admin_id")
    private List<Doctor> doctor;

    @OneToMany
    @JoinColumn(name = "user_Id")
    private List<User> user;
}
