package org.spring.loginregistration.controller;

import org.spring.loginregistration.model.PharmacyOrder;
import org.spring.loginregistration.service.PharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {
    private final PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    @PostMapping("/prices")
    public ResponseEntity<Map<String, Double>> getPrices(@RequestBody List<String> medicines) {
        return ResponseEntity.ok(pharmacyService.getPrices(medicines));
    }

    @PostMapping("/order")
    public ResponseEntity<PharmacyOrder> placeOrder(Authentication authentication, @RequestBody Map<String, Object> request) {
        Long userId = (Long) authentication.getPrincipal();
        List<String> medicines = (List<String>) request.get("medicines");
        String address = (String) request.get("address");
        double total = Double.parseDouble(request.get("total").toString());
        
        return ResponseEntity.ok(pharmacyService.placeOrder(userId, medicines, address, total));
    }
}
