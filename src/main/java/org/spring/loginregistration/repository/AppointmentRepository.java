package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Appointment;
import org.spring.loginregistration.model.Doctor;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
    List<Appointment> findByDoctor(Doctor doctor);
    
    // Added for latest-first sorting
    List<Appointment> findByUserOrderByIdDesc(User user);
    List<Appointment> findByDoctorOrderByIdDesc(Doctor doctor);
}
