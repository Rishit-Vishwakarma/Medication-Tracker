package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class PharmacyOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    private List<String> medicines;

    private double totalAmount;
    private String deliveryAddress;
    private String status; // PENDING, SHIPPED, DELIVERED
    private LocalDateTime orderDate;
}
