package org.spring.loginregistration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyOrderResponse {
    private Long id;
    private String patientName;
    private List<String> medicines;
    private double totalAmount;
    private String deliveryAddress;
    private String status;
    private LocalDateTime orderDate;
    private String estimatedTime;
}
