package com.medical.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Consultations")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateConsultation;
    @ManyToOne
    @JoinColumn(name = "docteurId")
    private Docteur docteur;
    @ManyToOne
    @JoinColumn(name = "patientId")
    private Patient patient;
    @OneToOne
    @JoinColumn(name = "ordonnanceId", nullable = true)
    @JsonIgnore
    private Ordonnance ordonnance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
      protected void onCreate() {
        this.createdAt = LocalDateTime.now();
      
    }
      @Column(name = "video_call_link")
private String videoCallLink;
      
    // Getters & Setters
      public String getVideoCallLink() {
    return videoCallLink;
}

public void setVideoCallLink(String videoCallLink) {
    this.videoCallLink = videoCallLink;
}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateConsultation() {
        return dateConsultation;
    }

    public void setDateConsultation(LocalDateTime dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public Docteur getDocteur() {
        return docteur;
    }

    public void setDocteur(Docteur docteur) {
        this.docteur = docteur;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Ordonnance getOrdonnance() {
        return ordonnance;
    }

    public void setOrdonnance(Ordonnance ordonnance) {
        this.ordonnance = ordonnance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
