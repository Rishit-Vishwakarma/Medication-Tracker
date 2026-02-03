package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "users")
@Getter
@Setter
@Entity
public class User {
@Id
@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
@Column(unique = true)
    private String email;
    private String username;
    private String password;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
}
