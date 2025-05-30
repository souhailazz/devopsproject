import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyConsultation.css';
import { MessageSquare, Calendar, Clock, User, Stethoscope, Video, Plus, FileText } from 'lucide-react';
import ChatOrdonnanceEditor from '../ChatOrdonnanceEditor/ChatOrdonnanceEditor';

// Component
const MyConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [ordonnanceContent, setOrdonnanceContent] = useState('');
  const [isEditingOrdonnance, setIsEditingOrdonnance] = useState(false);
  const [editingOrdonnanceId, setEditingOrdonnanceId] = useState(null);
  const [showOrdonnanceEditor, setShowOrdonnanceEditor] = useState(false);
  const [loadingOrdonnance, setLoadingOrdonnance] = useState(false);
  const [showOrdonnance, setShowOrdonnance] = useState(true);

  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  const safeText = (value, fallback = 'N/A') => (value && value.trim() !== '' ? value : fallback);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const fetchMessages = () => {
    if (selectedConsultation) {
      const patientId = selectedConsultation.patient?.id;
      const doctorId = selectedConsultation.docteur?.id;

      if (patientId && doctorId) {
        axios
          .get(`http://localhost:8080/api/messages/between?docteurId=${doctorId}&patientId=${patientId}`)
          .then((res) => setMessages(res.data))
          .catch((err) => {
            console.error('Error loading messages:', err);
            setError('Failed to load messages. Please try again.');
          });
      }
    }
  };

  // Function to fetch ordonnance for a specific consultation
  const fetchOrdonnance = async (consultationId) => {
    if (!consultationId) return null;
    
    setLoadingOrdonnance(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/ordonnances/consultation/${consultationId}`);
      setLoadingOrdonnance(false);
      return response.data;
    } catch (error) {
      console.log(`No ordonnance found for consultation ${consultationId}:`, error);
      setLoadingOrdonnance(false);
      return null;
    }
  };

  useEffect(() => {
    if (!userId || !userType) {
      setError('User session not found. Please login again.');
      setLoading(false);
      return;
    }

    const url =
      userType === 'patient'
        ? `http://localhost:8080/api/consultations/patient/${userId}`
        : `http://localhost:8080/api/consultations/doctor/${userId}`;

    setLoading(true);
    axios
      .get(url)
      .then(async (res) => {
        // Ensure we have an array of consultations
        const consultationsData = Array.isArray(res.data) ? res.data : [];
        
        // Fetch ordonnance for each consultation
        const consultationsWithOrdonnance = await Promise.all(
          consultationsData.map(async (consultation) => {
            const ordonnance = await fetchOrdonnance(consultation.id);
            return {
              ...consultation,
              ordonnance: ordonnance
            };
          })
        );

        setConsultations(consultationsWithOrdonnance);
        if (consultationsWithOrdonnance.length > 0) {
          setSelectedConsultation(consultationsWithOrdonnance[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load consultations. Please try again later.');
        console.error('Error loading consultations:', err);
        setConsultations([]); // Reset to empty array on error
        setLoading(false);
      });
  }, [userId, userType]);

  useEffect(() => {
    setMessages([]);
    fetchMessages();
    // Reset iframe loaded state when consultation changes
    setIframeLoaded(false);
  }, [selectedConsultation]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedConsultation]);

  useEffect(() => {
    const chatBox = document.querySelector('.chat-messages');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    let consultation = selectedConsultation;

    try {
      if (!consultation) {
        const newConsultation = {
          docteurId: userType === 'patient' ? 'targetDoctorId' : userId,
          patientId: userType === 'patient' ? userId : 'targetPatientId',
          reason: 'Message Initiated Chat',
          status: 'pending',
          dateConsultation: new Date().toISOString()
        };

        const res = await axios.post('http://localhost:8080/api/consultations', newConsultation);
        consultation = res.data;
        setConsultations((prev) => [...prev, consultation]);
        setSelectedConsultation(consultation);
      }

      let ordonnanceId = consultation.ordonnance?.id;

      if (!ordonnanceId) {
        console.log('Creating new ordonnance for consultation ID:', consultation.id);
        
        // Enhanced validation
        if (!consultation.id) {
          console.error('Cannot create ordonnance: Missing consultation ID');
          setError('Failed to create ordonnance: Missing consultation ID');
          return;
        }

        // Enhanced validation for docteur and patient IDs
        if (!consultation.docteur?.id || !consultation.patient?.id) {
          console.error('Cannot create ordonnance: Missing doctor or patient information');
          setError('Failed to create ordonnance: Missing doctor or patient information');
          return;
        }

        // Validate user type
        if (!userType || (userType !== 'docteur' && userType !== 'patient')) {
          console.error('Invalid user type for ordonnance creation');
          setError('Failed to create ordonnance: Invalid user type');
          return;
        }
        
        const ordonnancePayload = {
          consultationId: consultation.id,
          docteurId: consultation.docteur.id,
          patientId: consultation.patient.id,
          contenu: '',
          dateCreation: new Date().toISOString(),
          status: 'active'
        };

        console.log('Ordonnance payload:', ordonnancePayload);

        try {
          // First check if an ordonnance already exists
          const ordonnance = await fetchOrdonnance(consultation.id);
          if (ordonnance && ordonnance.id) {
            console.log('Ordonnance already exists:', ordonnance);
            ordonnanceId = ordonnance.id;
          } else {
            // Create new ordonnance only if one doesn't exist
            const ordonnanceResponse = await axios.post(`http://localhost:8080/api/ordonnances`, ordonnancePayload);
            console.log('Ordonnance creation response:', ordonnanceResponse.data);

            if (!ordonnanceResponse.data || !ordonnanceResponse.data.id) {
              throw new Error('Invalid response from ordonnance creation');
            }

            const updatedOrdonnance = ordonnanceResponse.data;
            
            // Update the selected consultation with the new ordonnance
            const updatedConsultation = {
              ...consultation,
              ordonnance: updatedOrdonnance
            };
            
            setSelectedConsultation(updatedConsultation);
            
            // Update the consultations list with the updated consultation
            setConsultations(prev => prev.map(c => c.id === consultation.id ? updatedConsultation : c));
            
            ordonnanceId = updatedOrdonnance.id;
            console.log('Created ordonnance with ID:', ordonnanceId);
          }
        } catch (error) {
          console.error('Error in ordonnance creation process:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
          setError(`Failed to create ordonnance: ${errorMessage}`);
          return;
        }
      }

      const dto = {
        docteurId: consultation.docteur?.id,
        patientId: consultation.patient?.id,
        ordonnanceId,
        senderType: userType === 'docteur' ? 'doctor' : 'patient',
        receiverType: userType === 'docteur' ? 'patient' : 'doctor',
        messageText: message,
        mediaUrl: null,
        mediaType: null
      };

      console.log('Message DTO:', dto);

      const res = await axios.post('http://localhost:8080/api/messages', dto);
      setMessages((prev) => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      console.error('Message sending or consultation creation failed:', err);
      console.error('Error details:', err.response?.data);
      setError(`Failed to send message: ${err.response?.data?.message || err.message}`);
    }
  };

  const getCounterpartyDetails = (consultation) => {
    if (userType === 'patient') {
      return {
        name: `Dr. ${consultation.docteur?.prenom} ${consultation.docteur?.nom}`,
        specialty: safeText(consultation.docteur?.speciality, 'General'),
        icon: <Stethoscope size={20} />
      };
    } else {
      return {
        name: `${consultation.patient?.prenom} ${consultation.patient?.nom}`,
        details: `Age: ${consultation.patient?.age || 'N/A'} | Gender: ${consultation.patient?.gender || 'N/A'}`,
        icon: <User size={20} />
      };
    }
  };

  const isMessageFromCurrentUser = (msg) => {
    if (userType === 'docteur') {
      return msg.senderType === 'doctor';
    } else {
      return msg.senderType === 'patient';
    }
  };
  const filteredConsultations = Array.isArray(consultations) 
    ? consultations.filter((consultation) => {
        if (activeTab === 'PENDING') return consultation.etat === 'PENDING' || !consultation.etat;
        if (activeTab === 'ACCEPTED') return consultation.etat === 'ACCEPTED';
        if (activeTab === 'COMPLETED') return consultation.etat === 'COMPLETED';
        if (activeTab === 'DENIED') return consultation.etat === 'DENIED';
        return true;
      })
    : [];

  // Debug: Log the selected consultation to see if videoCallLink exists
  console.log('Selected consultation:', selectedConsultation);
  console.log('Video call URL:', selectedConsultation?.videoCallLink);

  const handleEditOrdonnance = async (ordonnanceId, content) => {
    try {
      setIsEditingOrdonnance(true);
      const response = await axios.put(`http://localhost:8080/api/ordonnances/${ordonnanceId}`, {
        contenu: content,
        status: 'active'
      });

      if (response.data) {
        // Update the consultation with the new ordonnance
        const updatedConsultation = {
          ...selectedConsultation,
          ordonnance: response.data
        };
        setSelectedConsultation(updatedConsultation);
        setConsultations(prev => prev.map(c => c.id === updatedConsultation.id ? updatedConsultation : c));
        setEditingOrdonnanceId(null);
      }
    } catch (err) {
      console.error('Error updating ordonnance:', err);
      setError('Failed to update ordonnance. Please try again.');
    } finally {
      setIsEditingOrdonnance(false);
    }
  };

  // Modify the consultation selection handler
  const handleConsultationSelect = async (consultation) => {
    try {
      // Get the latest ordonnance data
      const ordonnance = await fetchOrdonnance(consultation.id);
      const consultationWithOrdonnance = {
        ...consultation,
        ordonnance: ordonnance
      };
      setSelectedConsultation(consultationWithOrdonnance);
    } catch (error) {
      console.log(`Error fetching ordonnance for consultation ${consultation.id}:`, error);
      setSelectedConsultation(consultation);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Consultation List */}
          <div className="consultations-list-container">
            <div className="tabs">
              {['PENDING', 'ACCEPTED', 'COMPLETED', 'DENIED'].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <h3 className="list-title">
              {userType === 'patient' ? 'My Consultations' : 'Patient Consultations'}
            </h3>

            <div className="consultations-list">
              {error && <p className="error-message">{error}</p>}
              {loading && <p className="loading">Loading consultations...</p>}
              {!loading && filteredConsultations.length === 0 ? (
                <p className="no-consultations">No consultations found</p>
              ) : (
                filteredConsultations.map((consultation) => (
                  <div
                    className={`consultation-item ${selectedConsultation?.id === consultation.id ? 'selected' : ''}`}
                    key={consultation.id}
                    onClick={() => handleConsultationSelect(consultation)}
                  >
                    <div className="consultation-details">
                      <h4 className="counterparty-name">
                        {userType === 'patient'
                          ? `Dr. ${consultation.docteur?.prenom} ${consultation.docteur?.nom}`
                          : `${consultation.patient?.prenom} ${consultation.patient?.nom}`}
                      </h4>
                      {userType === 'doctor' && (
                        <p className="patient-age">Age: {consultation.patient?.age || 'N/A'}</p>
                      )}
                      <div className="consultation-time">
                        <Calendar className="icon" size={16} />
                        <span>{formatDate(consultation.dateConsultation)}</span>
                        <Clock className="icon" size={16} />
                        <span>{formatTime(consultation.dateConsultation)}</span>
                      </div>
                    </div>
                    <div className="status-badge">{consultation.etat || 'PENDING'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Consultation Details */}
          {selectedConsultation && (
            <div className="consultation-detail">
              <div className="consultation-header">
                <div>
                  {(() => {
                    const counterparty = getCounterpartyDetails(selectedConsultation);
                    return (
                      <>
                        <div className="header-with-icon">
                          {counterparty.icon}
                          <h3 className="detail-name">{counterparty.name}</h3>
                        </div>
                        <p className="detail-info">
                          {userType === 'patient'
                            ? `Specialty: ${counterparty.specialty}`
                            : counterparty.details}
                        </p>
                      </>
                    );
                  })()}
                  <p className="appointment-time">
                    <Calendar className="icon" size={16} />
                    {formatDate(selectedConsultation.dateConsultation)} at{' '}
                    <Clock className="icon" size={16} />
                    {formatTime(selectedConsultation.dateConsultation)}
                  </p>
                </div>
                <div className="appointment-status">
                  Status: <span className="status">{selectedConsultation.etat || 'PENDING'}</span>
                </div>
              </div>

              {/* Debug: Show if video call URL exists */}
              {selectedConsultation.videoCallLink && selectedConsultation.etat === 'ACCEPTED' && (
                <div className="video-call-section">
                  <div className="video-call-header">
                    <Video size={20} />
                    <h4>Live Video Call</h4>
                    <small style={{marginLeft: '10px', color: '#666'}}>
                      URL: {selectedConsultation.videoCallLink}
                    </small>
                  </div>

                  <div className="video-call-container">
                    {/* Fallback Join Button */}
                    <div className="video-call-fallback">
                      <a
                        href={selectedConsultation.videoCallLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        classaName="join-button"
                        style={{
                          display: 'inline-block',
                          padding: '10px 20px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '5px',
                          marginBottom: '10px'
                        }}
                      >
                        Join Video Call in New Window
                      </a>
                    </div>

                    {/* Iframe embed */}
                    <div className="video-call-iframe-container" style={{
                      position: 'relative',
                      width: '100%',
                      height: '300px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      {!iframeLoaded && (
                        <div className="iframe-loading" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}>
                          <div className="loading-spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 2s linear infinite'
                          }}></div>
                          <p style={{marginTop: '10px'}}>Loading video call...</p>
                        </div>
                      )}
                      <iframe
                        src={selectedConsultation.videoCallLink}
                        title="Video Call"
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        allowFullScreen
                        className="video-call-iframe"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          opacity: iframeLoaded ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                        onLoad={(e) => {
                          console.log('Iframe loaded successfully');
                          setIframeLoaded(true);
                        }}
                        onError={(e) => {
                          console.error('Error loading iframe:', e);
                          setError('Failed to load video call. Please try the fallback link.');
                          setIframeLoaded(true); // Show error state
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {userType === 'doctor' && (
                <div className="medical-notes">
                  <h4>Medical Notes</h4>
                  <p>{selectedConsultation.notes || 'No notes available yet'}</p>
                </div>
              )}

              <div className="chat-section">
                <div className="chat-header">
                  <div className="chat-header-left">
                    <MessageSquare size={18} />
                    <span>Messages</span>
                  </div>
                  {userType === 'docteur' && selectedConsultation.etat === 'ACCEPTED' && (
                    <button 
                      className="edit-ordonnance-btn"
                      onClick={() => setShowOrdonnanceEditor(true)}
                    >
                      <Plus size={18} />
                      Modifier Ordonnance
                    </button>
                  )}
                </div>

                {/* Ordonnance Section */}
                <div className="fixed-ordonnance-section">
                  <div className="ordonnance-header" onClick={() => setShowOrdonnance(!showOrdonnance)} style={{ cursor: 'pointer' }}>
                    <FileText size={18} />
                    <h4>Ordonnance</h4>
                    <span style={{ marginLeft: 'auto' }}>{showOrdonnance ? '▼' : '▶'}</span>
                  </div>
                  
                  {showOrdonnance && (
                    <>
                      {loadingOrdonnance ? (
                        <div className="loading-ordonnance">
                          <p>Loading ordonnance...</p>
                        </div>
                      ) : editingOrdonnanceId === selectedConsultation.id && userType === 'docteur' && selectedConsultation.etat === 'ACCEPTED' ? (
                        <div className="ordonnance-editor">
                          <textarea
                            value={ordonnanceContent}
                            onChange={(e) => setOrdonnanceContent(e.target.value)}
                            className="ordonnance-textarea"
                            rows={4}
                          />
                          <div className="ordonnance-actions">
                            <button 
                              onClick={() => setEditingOrdonnanceId(null)} 
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleEditOrdonnance(selectedConsultation.ordonnance.id, ordonnanceContent)} 
                              className="save-btn"
                              disabled={isEditingOrdonnance}
                            >
                              {isEditingOrdonnance ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="ordonnance-content">
                          {selectedConsultation.ordonnance ? (
                            <>
                              <div className="ordonnance-info">
                                <div className="ordonnance-date">
                                  <strong>Date:</strong> {formatDate(selectedConsultation.ordonnance.dateCreation)}
                                </div>
                                {selectedConsultation.ordonnance.docteur && (
                                  <div className="ordonnance-doctor">
                                    <strong>Médecin:</strong> Dr. {selectedConsultation.ordonnance.docteur.prenom} {selectedConsultation.ordonnance.docteur.nom}
                                    {selectedConsultation.ordonnance.docteur.specialite && (
                                      <span className="specialty">({selectedConsultation.ordonnance.docteur.specialite})</span>
                                    )}
                                  </div>
                                )}
                                {selectedConsultation.ordonnance.patient && (
                                  <div className="ordonnance-patient">
                                    <strong>Patient:</strong> {selectedConsultation.ordonnance.patient.prenom} {selectedConsultation.ordonnance.patient.nom}
                                  </div>
                                )}
                              </div>
                              <div className="ordonnance-prescription">
                                <h5>Prescription:</h5>
                                <pre>{selectedConsultation.ordonnance.contenu || 'No prescription content available'}</pre>
                              </div>
                            </>
                          ) : (
                            <p>No ordonnance available for this consultation</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <p className="no-messages">No messages </p>
                  ) : (
                    messages.map((msg, index) => {
                      const isFromMe = isMessageFromCurrentUser(msg);
                      let senderName;
                      
                      if (msg.senderType === 'doctor') {
                        senderName = `Dr. ${msg.docteur?.prenom || ''} ${msg.docteur?.nom || ''}`;
                      } else {
                        senderName = `${msg.patient?.prenom || ''} ${msg.patient?.nom || ''}`;
                      }

                      return (
                        <div key={index} className={`chat-bubble ${isFromMe ? 'sent' : 'received'}`}>
                          <div className="message-header">
                            <span className="message-sender">{isFromMe ? 'You' : senderName}</span>
                          </div>
                          <p className="message-text">{msg.messageText}</p>
                          <span className="message-time">
                            {msg.timestamp ? formatTime(msg.timestamp) : ''}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedConsultation.etat === 'ACCEPTED' && (
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn-send" onClick={handleSendMessage}>
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showOrdonnanceEditor && selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content ordonnance-editor-modal">
            <div className="modal-header">
              <h3>Modifier Ordonnance</h3>
              <button 
                className="close-modal"
                onClick={() => setShowOrdonnanceEditor(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ChatOrdonnanceEditor 
                consultationId={selectedConsultation.id}
                onClose={() => {
                  setShowOrdonnanceEditor(false);
                  // Refresh the ordonnance data after editing
                  fetchOrdonnance(selectedConsultation.id).then(ordonnance => {
                    if (ordonnance) {
                      setSelectedConsultation({
                        ...selectedConsultation,
                        ordonnance: ordonnance
                      });
                    }
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyConsultation;