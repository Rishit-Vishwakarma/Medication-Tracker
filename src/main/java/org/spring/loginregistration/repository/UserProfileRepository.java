package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
}
