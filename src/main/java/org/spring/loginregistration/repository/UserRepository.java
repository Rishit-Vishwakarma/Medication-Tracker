package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByDoctor(Doctor doctor);
    Optional<User> findTopByDoctorOrderByIdDesc(Doctor doctor); // Added missing method
}
