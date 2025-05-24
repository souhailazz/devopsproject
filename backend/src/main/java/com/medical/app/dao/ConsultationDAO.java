package com.medical.app.dao;

import com.medical.app.model.Consultation;
import com.medical.app.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConsultationDAO {

    @Autowired
    private ConsultationRepository consultationRepository;

    public Consultation save(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    public Consultation findById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        consultationRepository.deleteById(id);
    }

    public List<Consultation> findByDocteurId(Long docteurId) {
        return consultationRepository.findByDocteurId(docteurId);
    }

    public List<Consultation> findByPatientId(Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
}
