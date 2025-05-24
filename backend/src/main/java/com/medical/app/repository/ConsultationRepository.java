package com.medical.app.repository;

import com.medical.app.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByDocteurId(Long docteurId);
    List<Consultation> findByPatientId(Long patientId);
}
