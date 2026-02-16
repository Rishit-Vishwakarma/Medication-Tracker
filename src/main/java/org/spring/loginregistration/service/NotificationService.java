package org.spring.loginregistration.service;

import org.spring.loginregistration.model.Notification;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(User user, String message) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    public List<Notification> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserOrderByTimestampDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
