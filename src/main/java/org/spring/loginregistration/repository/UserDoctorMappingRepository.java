package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.spring.loginregistration.model.UserDoctorMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDoctorMappingRepository extends JpaRepository<UserDoctorMapping, Long> {
    boolean existsByUser(User user);
    List<UserDoctorMapping>findByDoctor(Doctor doctor);
    List<UserDoctorMapping>findByUser(User user);
}
