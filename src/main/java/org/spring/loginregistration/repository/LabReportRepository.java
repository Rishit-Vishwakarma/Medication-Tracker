package org.spring.loginregistration.repository;

import org.spring.loginregistration.model.LabReport;
import org.spring.loginregistration.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByUserOrderByUploadDateDesc(User user);
}
