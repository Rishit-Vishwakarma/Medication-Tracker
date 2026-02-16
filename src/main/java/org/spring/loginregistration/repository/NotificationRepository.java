package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.Notification;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
    List<Notification> findByDoctorOrderByTimestampDesc(Doctor doctor);
    
    long countByUserAndIsReadFalse(User user);
    long countByDoctorAndIsReadFalse(Doctor doctor);
}
