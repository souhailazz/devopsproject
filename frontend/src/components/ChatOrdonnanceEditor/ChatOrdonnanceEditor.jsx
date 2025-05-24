import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatOrdonnanceEditor = ({ consultationId, onClose }) => {
  const [ordonnance, setOrdonnance] = useState(null);
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    const loadOrdonnance = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/ordonnances/consultation/${consultationId}`);
        setOrdonnance(res.data);
        setContenu(res.data.contenu);
      } catch (error) {
        console.error("Erreur lors du chargement de l'ordonnance :", error);
      }
    };
    loadOrdonnance();
  }, [consultationId]);

  const updateOrdonnance = async () => {
    try {
      await axios.put(`http://localhost:8080/api/ordonnances/${ordonnance.id}`, {
        ...ordonnance,
        contenu,
      });
      onClose();
      alert("Ordonnance mise à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="ordonnance-editor-container">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows={10}
        className="ordonnance-textarea"
        placeholder="Entrez le contenu de l'ordonnance..."
      />
      <div className="ordonnance-actions">
        <button onClick={updateOrdonnance} className="save-btn">💾 Enregistrer</button>
        <button onClick={onClose} className="cancel-btn">❌ Fermer</button>
      </div>
    </div>
  );
};

export default ChatOrdonnanceEditor;
