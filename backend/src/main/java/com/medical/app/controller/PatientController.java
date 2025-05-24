package com.medical.app.controller;

import com.medical.app.dto.LoginRequest;
import com.medical.app.model.Patient;
import com.medical.app.service.PatientService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173") // adapte si besoin
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient savedPatient = patientService.savePatient(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Integer id) {
        Patient patient = patientService.getPatientById(id);
        if (patient != null) {
            return new ResponseEntity<>(patient, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Integer id, @RequestBody Patient patient) {
        Patient updatedPatient = patientService.updatePatient(id, patient);
        if (updatedPatient != null) {
            return new ResponseEntity<>(updatedPatient, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Integer id) {
        Patient patient = patientService.getPatientById(id);
        if (patient != null) {
            patientService.deletePatient(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
// ...

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
    Optional<Patient> optionalPatient = patientService.findByEmail(loginRequest.getEmail());

    if (optionalPatient.isPresent()) {
        Patient patient = optionalPatient.get();

        if (patient.getMotDePasse().equals(loginRequest.getMotDePasse())) {
            session.setAttribute("patientId", patient.getId());
            return new ResponseEntity<>(patient, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Mot de passe incorrect", HttpStatus.UNAUTHORIZED);
        }
    } else {
        return new ResponseEntity<>("Patient non trouvé", HttpStatus.NOT_FOUND);
    }
}


    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInPatient(HttpSession session) {
        Integer patientId = (Integer) session.getAttribute("patientId");
        if (patientId == null) {
            return new ResponseEntity<>("Non connecté", HttpStatus.UNAUTHORIZED);
        }
        Patient patient = patientService.getPatientById(patientId);
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    /**
     *
     * @param session
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return new ResponseEntity<>("Déconnecté avec succès", HttpStatus.OK);
    }
}
