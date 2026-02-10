package org.spring.loginregistration.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private double price;

    public Medicine() {}
    public Medicine(String name, double price) {
        this.name = name;
        this.price = price;
    }
}
