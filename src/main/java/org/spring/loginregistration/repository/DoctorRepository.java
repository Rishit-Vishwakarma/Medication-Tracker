package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findDoctorByEmail(String email);
}
