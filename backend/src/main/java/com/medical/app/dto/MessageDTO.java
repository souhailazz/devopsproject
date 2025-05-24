package com.medical.app.dto;

import java.time.LocalDateTime;

public class MessageDTO {

    private Long id;
    private Long docteurId;
    private Long patientId;
    private Long ordonnanceId;
    private String messageText;
    private String mediaUrl;
    private String mediaType;
    private LocalDateTime timestamp;

    // Constructors
    public MessageDTO() {}

    public MessageDTO(Long id, Long docteurId, Long patientId, Long ordonnanceId,
                      String messageText, String mediaUrl, String mediaType, LocalDateTime timestamp) {
        this.id = id;
        this.docteurId = docteurId;
        this.patientId = patientId;
        this.ordonnanceId = ordonnanceId;
        this.messageText = messageText;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocteurId() { return docteurId; }
    public void setDocteurId(Long docteurId) { this.docteurId = docteurId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getOrdonnanceId() { return ordonnanceId; }
    public void setOrdonnanceId(Long ordonnanceId) { this.ordonnanceId = ordonnanceId; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}