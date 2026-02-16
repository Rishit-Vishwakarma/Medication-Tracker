package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Notification;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
    long countByUserAndIsReadFalse(User user);
}
