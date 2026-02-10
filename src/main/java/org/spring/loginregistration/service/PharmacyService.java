package org.spring.loginregistration.service;

import org.spring.loginregistration.model.Medicine;
import org.spring.loginregistration.model.PharmacyOrder;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.MedicineRepository;
import org.spring.loginregistration.repository.PharmacyOrderRepository;
import org.spring.loginregistration.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PharmacyService {
    private final MedicineRepository medicineRepository;
    private final PharmacyOrderRepository orderRepository;
    private final UserRepository userRepository;

    public PharmacyService(MedicineRepository medicineRepository, PharmacyOrderRepository orderRepository, UserRepository userRepository) {
        this.medicineRepository = medicineRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Double> getPrices(List<String> medicineNames) {
        return medicineNames.stream()
                .collect(Collectors.toMap(
                        name -> name,
                        name -> medicineRepository.findByName(name)
                                .map(Medicine::getPrice)
                                .orElse(10.0) // Default price if not in DB
                ));
    }

    public PharmacyOrder placeOrder(Long userId, List<String> medicines, String address, double total) {
        User user = userRepository.findById(userId).orElseThrow();
        PharmacyOrder order = new PharmacyOrder();
        order.setUser(user);
        order.setMedicines(medicines);
        order.setDeliveryAddress(address);
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
