 package com.medical.app.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "docteur_id")
    private int docteurId;  // ID of the doctor (sender)
    
    @Column(name = "patient_id")
    private int patientId;  // ID of the patient (receiver)
    
    @Column(name = "ordonnance_id")
    private int ordonnanceId;  // ID of the ordonnance (consultation)
    
    @Column(name = "message_text")
    private String messageText;  // The text of the message
    
    @Column(name = "media_url")
    private String mediaUrl;  // URL of any media (e.g., image, video, file)
    
    @Column(name = "media_type")
    private String mediaType;  // Type of media ('image', 'video', 'file', or NULL)
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;  // Timestamp of when the message was created
    
    @ManyToOne
    @JoinColumn(name = "docteur_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Docteur docteur;  // Reference to the Docteur entity (sender)
    
    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Patient patient;  // Reference to the Patient entity (receiver)
    @Column(name = "sender_type")
private String senderType;

@Column(name = "receiver_type")
private String receiverType;
    // Fixed column name to match the database
    @ManyToOne
    @JoinColumn(name = "ordonnance_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Ordonnance ordonnance;  // Reference to the Ordonnance entity (consultation)
    
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();  // Set the timestamp before persisting
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
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
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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