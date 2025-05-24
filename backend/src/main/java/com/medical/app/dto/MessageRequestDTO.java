// Fixed MessageRequestDTO with proper field order and organization
package com.medical.app.dto;

import jakarta.persistence.Column;

public class MessageRequestDTO {
    private int docteurId;
    private int patientId;
@Column(name = "ordonnance_id")
    private int ordonnanceId;
private String senderType;  
private String receiverType;
    private String messageText;
    private String mediaUrl;    
    private String mediaType;
    
    // Getters and Setters
    public int getDocteurId() {
        return docteurId;
    }
    
    public void setDocteurId(int docteurId) {
        this.docteurId = docteurId;
    }
    
    public int getPatientId() {
        return patientId;
    }
    
    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }
    
    public int getOrdonnanceId() {
        return ordonnanceId;
    }
    
    public void setOrdonnanceId(int ordonnanceId) {
        this.ordonnanceId = ordonnanceId;
    }
    
    public String getMessageText() {
        return messageText;
    }
    
    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }
    
    public String getMediaUrl() {
        return mediaUrl;
    }
    
    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }
    
    public String getMediaType() {
        return mediaType;
    }
    
    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
    public String getSenderType() {
    return senderType;
}

public void setSenderType(String senderType) {
    this.senderType = senderType;
}

public String getReceiverType() {
    return receiverType;
}

public void setReceiverType(String receiverType) {
    this.receiverType = receiverType;
}

}
