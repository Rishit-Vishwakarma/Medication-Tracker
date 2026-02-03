package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.DoctorProfile;
import org.spring.loginregistration.model.Prescription;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository extends JpaRepository<Prescription,Long> {
    Optional<Prescription> findTopByUserOrderByIdDesc(User user);
    Optional<Prescription> findTopByDoctorOrderByIdDesc(Doctor doctor);
    List<Prescription> findByUser(User user);
}
