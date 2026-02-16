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
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PharmacyService {
    private final MedicineRepository medicineRepository;
    private final PharmacyOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService; // Added

    public PharmacyService(MedicineRepository medicineRepository, PharmacyOrderRepository orderRepository, 
                           UserRepository userRepository, NotificationService notificationService) {
        this.medicineRepository = medicineRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Map<String, Double> getPrices(List<String> medicineNames) {
        return medicineNames.stream()
                .collect(Collectors.toMap(name -> name, name -> medicineRepository.findByName(name).map(Medicine::getPrice).orElse(150.0)));
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
        
        int hours = new Random().nextInt(3) + 2;
        order.setEstimatedTime(hours + "-" + (hours + 1) + " Hours");
        
        PharmacyOrder saved = orderRepository.save(order);
        notificationService.createNotification(user, "Order #" + saved.getId() + " placed successfully! Estimated delivery: " + saved.getEstimatedTime());
        return saved;
    }

    public List<PharmacyOrder> getMyOrders(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepository.findByUserOrderByIdDesc(user);
    }

    public List<PharmacyOrder> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    public PharmacyOrder updateOrderStatus(Long orderId, String status) {
        PharmacyOrder order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        
        notificationService.createNotification(order.getUser(), "Your medicine order #" + order.getId() + " is now " + status);
        return orderRepository.save(order);
    }
}
