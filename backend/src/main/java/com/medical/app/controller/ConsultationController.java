package com.medical.app.controller;

import com.medical.app.dto.ConsultationDTO;
import com.medical.app.model.Consultation;
import com.medical.app.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public Consultation createConsultation(@RequestBody ConsultationDTO consultationDTO) {
        return consultationService.createConsultation(consultationDTO);
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @DeleteMapping("/{id}")
    public void deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Consultation> getConsultationsByDoctorId(@PathVariable Long doctorId) {
        return consultationService.getConsultationsByDoctorId(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getConsultationsByPatientId(@PathVariable Long patientId) {
        return consultationService.getConsultationsByPatientId(patientId);
    }
}
