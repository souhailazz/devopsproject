package com.medical.app.controller;

import com.medical.app.dto.MessageRequestDTO;
import com.medical.app.model.Docteur;
import com.medical.app.model.Message;
import com.medical.app.model.Ordonnance;
import com.medical.app.model.Patient;
import com.medical.app.repository.DocteurRepository;
import com.medical.app.repository.OrdonnanceRepository;
import com.medical.app.repository.PatientRepository;
import com.medical.app.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {
    private final MessageService messageService;
    private final DocteurRepository docteurRepository;
    private final PatientRepository patientRepository;
    private final OrdonnanceRepository ordonnanceRepository;
    
    public MessageController(
            MessageService messageService,
            DocteurRepository docteurRepository,
            PatientRepository patientRepository,
            OrdonnanceRepository ordonnanceRepository
    ) {
        this.messageService = messageService;
        this.docteurRepository = docteurRepository;
        this.patientRepository = patientRepository;
        this.ordonnanceRepository = ordonnanceRepository;
    }
    
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequestDTO dto) {
        Docteur docteur = docteurRepository.findById(dto.getDocteurId())
                .orElseThrow(() -> new RuntimeException("Docteur not found"));
        
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        // Verify ordonnance exists before proceeding
        Ordonnance ordonnance = ordonnanceRepository.findById(dto.getOrdonnanceId())
                .orElseThrow(() -> new RuntimeException("Ordonnance not found"));
                
        Message message = new Message();
        // Set IDs directly instead of entity references
        message.setDocteurId(dto.getDocteurId());
        message.setPatientId(dto.getPatientId());
        message.setOrdonnanceId(dto.getOrdonnanceId());
        message.setMessageText(dto.getMessageText());
        message.setMediaUrl(dto.getMediaUrl());
        message.setMediaType(dto.getMediaType());
        message.setSenderType(dto.getSenderType());
message.setReceiverType(dto.getReceiverType());

        return ResponseEntity.ok(messageService.sendMessage(message));
    }
    
    @GetMapping
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable int id) {
        return messageService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/between")
    public List<Message> getMessagesBetween(
            @RequestParam int docteurId,
            @RequestParam int patientId) {
        return messageService.getMessagesBetween(docteurId, patientId);
    }
}
