package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByName(String name);
}
