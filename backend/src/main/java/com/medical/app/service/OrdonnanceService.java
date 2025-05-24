package com.medical.app.service;

import com.medical.app.model.Docteur;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medical.app.dao.DocteurDAO;
import com.medical.app.dao.PatientDAO;
import com.medical.app.model.Ordonnance;
import com.medical.app.model.Patient;
import com.medical.app.repository.OrdonnanceRepository;

@Service
public class OrdonnanceService {
@Autowired
private DocteurDAO docteurDao;

@Autowired
private PatientDAO patientDao;

    @Autowired
    private OrdonnanceRepository ordonnanceRepository;
    
    public List<Ordonnance> getAllOrdonnances() {
        return ordonnanceRepository.findAll();
    }
    
    public Optional<Ordonnance> getOrdonnanceById(Long id) {
        return ordonnanceRepository.findById(id);
    }
    
    public List<Ordonnance> getOrdonnancesByDocteur(Long docteurId) {
        return ordonnanceRepository.findByDocteurId(docteurId);
    }
    
    public List<Ordonnance> getOrdonnancesByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientId(patientId);
    }
    
    public List<Ordonnance> getOrdonnancesByDocteurAndPatient(Long docteurId, Long patientId) {
        return ordonnanceRepository.findByDocteurIdAndPatientId(docteurId, patientId);
    }
    
    public Ordonnance createOrdonnance(Ordonnance ordonnance) {
        if (ordonnance.getCreatedAt() == null) {
            ordonnance.setCreatedAt(LocalDateTime.now());
        }
        if (ordonnance.getDateCreation() == null) {
            ordonnance.setDateCreation(LocalDateTime.now());
        }
        return ordonnanceRepository.save(ordonnance);
    }
    
    public Ordonnance updateOrdonnance(Long id, Ordonnance ordonnanceDetails) {
        
        Optional<Ordonnance> ordonnance = ordonnanceRepository.findById(id);
        if (ordonnance.isPresent()) {
            Docteur docteur = docteurDao.findById(ordonnanceDetails.getDocteur().getId());
Patient patient = patientDao.findById(ordonnanceDetails.getPatient().getId());
            Ordonnance existingOrdonnance = ordonnance.get();
            existingOrdonnance.setContenu(ordonnanceDetails.getContenu());
            existingOrdonnance.setDocteur(docteur);
existingOrdonnance.setPatient(patient);
         
            existingOrdonnance.setDateCreation(ordonnanceDetails.getDateCreation());
            return ordonnanceRepository.save(existingOrdonnance);
        }
        return null;
    }
    
    public boolean deleteOrdonnance(Long id) {
        Optional<Ordonnance> ordonnance = ordonnanceRepository.findById(id);
        if (ordonnance.isPresent()) {
            ordonnanceRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
public Optional<Ordonnance> getOrdonnanceByConsultationId(Long consultationId) {
    return ordonnanceRepository.findByConsultationId(consultationId);
}
}