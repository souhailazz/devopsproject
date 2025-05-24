package com.medical.app.service;

import com.medical.app.model.Message;
import com.medical.app.repository.MessageRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author souhail
 */

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(int id) {
        return messageRepository.findById(id);
    }

    public List<Message> getMessagesBetween(int docteurId, int patientId) {
        return messageRepository.findByDocteurIdAndPatientId(docteurId, patientId);
    }
}