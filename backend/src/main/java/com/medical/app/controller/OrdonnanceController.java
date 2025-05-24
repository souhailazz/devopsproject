package com.medical.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medical.app.model.Ordonnance;
import com.medical.app.service.OrdonnanceService;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/ordonnances")
public class OrdonnanceController {

    @Autowired
    private OrdonnanceService ordonnanceService;
    
    @GetMapping
    public ResponseEntity<List<Ordonnance>> getAllOrdonnances(
            @RequestParam(required = false) Long docteurId,
            @RequestParam(required = false) Long patientId) {
        
        List<Ordonnance> ordonnances;
        
        if (docteurId != null && patientId != null) {
            ordonnances = ordonnanceService.getOrdonnancesByDocteurAndPatient(docteurId, patientId);
        } else if (docteurId != null) {
            ordonnances = ordonnanceService.getOrdonnancesByDocteur(docteurId);
        } else if (patientId != null) {
            ordonnances = ordonnanceService.getOrdonnancesByPatient(patientId);
        } else {
            ordonnances = ordonnanceService.getAllOrdonnances();
        }
        
        return new ResponseEntity<>(ordonnances, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ordonnance> getOrdonnanceById(@PathVariable Long id) {
        Optional<Ordonnance> ordonnance = ordonnanceService.getOrdonnanceById(id);
        return ordonnance.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    public ResponseEntity<Ordonnance> createOrdonnance(@RequestBody Ordonnance ordonnance) {
        Ordonnance newOrdonnance = ordonnanceService.createOrdonnance(ordonnance);
        return new ResponseEntity<>(newOrdonnance, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ordonnance> updateOrdonnance(@PathVariable Long id, @RequestBody Ordonnance ordonnance) {
        Ordonnance updatedOrdonnance = ordonnanceService.updateOrdonnance(id, ordonnance);
        if (updatedOrdonnance != null) {
            return new ResponseEntity<>(updatedOrdonnance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
   @GetMapping("/consultation/{consultationId}")
public ResponseEntity<Ordonnance> getOrdonnanceByConsultationId(@PathVariable Long consultationId) {
    Optional<Ordonnance> ordonnance = ordonnanceService.getOrdonnanceByConsultationId(consultationId);
    return ordonnance.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}
}