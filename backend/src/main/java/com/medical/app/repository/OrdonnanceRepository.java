/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.medical.app.repository;

import com.medical.app.model.Ordonnance;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author souhail
 */
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Integer> {
    List<Ordonnance> findByDocteurId(Long docteurId);
    
    // Find all ordonnances by patientId
    List<Ordonnance> findByPatientId(Long patientId);
    
    // Find all ordonnances by docteurId and patientId
    List<Ordonnance> findByDocteurIdAndPatientId(Long docteurId, Long patientId);
Optional<Ordonnance> findByConsultationId(Long consultationId);
    public Optional<Ordonnance> findById(Long id);

    public void deleteById(Long id);
}
