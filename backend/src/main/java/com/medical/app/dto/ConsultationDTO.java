package com.medical.app.dto;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class ConsultationDTO {
    private Long docteurId;
    private Long patientId;
private String videoCallLink;

    private LocalDateTime dateConsultation;


    // Getters & Setters
    public Long getDocteurId() {
        return docteurId;
    }

    public void setDocteurId(Long docteurId) {
        this.docteurId = docteurId;
    }

    public Long getPatientId() {
        return patientId;
    }
public String getVideoCallLink() {
    return videoCallLink;
}

public void setVideoCallLink(String videoCallLink) {
    this.videoCallLink = videoCallLink;
}
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getDateConsultation() {
        return dateConsultation;
    }

    public void setDateConsultation(LocalDateTime dateConsultation) {
        this.dateConsultation = dateConsultation;
    }
}
