package com.medical.app.dao;

import com.medical.app.model.Patient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class PatientDAO implements IDAO<Patient, Integer> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Patient save(Patient patient) {
    if (patient.getId() == 0) { // Assuming 0 is invalid
        entityManager.persist(patient); // New patient
        return patient;
    } else {
        return entityManager.merge(patient); // Update existing
    }
}



    @Override
    public List<Patient> findAll() {
        return entityManager.createQuery("FROM Patient", Patient.class).getResultList();
    }

    @Override
    public Patient findById(Integer id) {
        return entityManager.find(Patient.class, id);
    }

    @Override
    public void delete(Integer id) {
        Patient patient = findById(id);
        if (patient != null) {
            entityManager.remove(patient);
        }
    }
    
    @Override 
    public Optional<Patient> findByEmail(String email) {
        List<Patient> patients = entityManager.createQuery(
            "SELECT p FROM Patient p WHERE p.email = :email", Patient.class)
            .setParameter("email", email)
            .getResultList();

        if (patients.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(patients.get(0));
    }
public Patient findById(Long id) {
    return entityManager.find(Patient.class, id);
}

}
