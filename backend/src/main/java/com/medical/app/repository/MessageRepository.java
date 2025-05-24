/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.medical.app.repository;


import com.medical.app.model.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByDocteurIdAndPatientId(int docteurId, int patientId);
    List<Message> findByPatientId(int patientId);
    List<Message> findByDocteurId(int docteurId);
}
