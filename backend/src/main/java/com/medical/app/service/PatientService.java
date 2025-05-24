package com.medical.app.service;

import com.medical.app.dao.PatientDAO;
import com.medical.app.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientDAO patientDAO;

    @Autowired // Constructor injection is recommended
    public PatientService(PatientDAO patientDAO) {
        this.patientDAO = patientDAO;
    }

    public Patient savePatient(Patient patient) {
        return patientDAO.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientDAO.findAll();
    }

    public Patient getPatientById(Integer id) {
        return patientDAO.findById(id); // Already handles null check internally
    }

    public void deletePatient(Integer id) {
        patientDAO.delete(id); // Uses DAO's delete method
    }

    public Patient updatePatient(Integer id, Patient patient) {
        Patient existingPatient = patientDAO.findById(id);
        if (existingPatient != null) {
            patient.setId(id); // Ensure the patient ID is set for update
            return patientDAO.save(patient);
        }
        return null;
    }
    public Optional<Patient> findByEmail(String email) {
        return patientDAO.findByEmail(email);
    }
}
