import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, MapPin, Building, Phone, Calendar, ArrowLeft } from "lucide-react";
import "./ResponseSearch.css";

export default function ResponseSearch() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specialty = searchParams.get("specialite");
  const city = searchParams.get("city");
  const handleBookConsultation = async (docteurId) => {
    const patientId = localStorage.getItem("userId");
  
    if (!patientId) {
      alert("You must be logged in as a patient to book a consultation.");
      return;
    }
  
    const now = new Date(); // Or pick a specific datetime
    const consultationDTO = {
      docteurId: parseInt(docteurId),
      patientId: parseInt(patientId),
      dateConsultation: now.toISOString() // Backend expects ISO format
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationDTO),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }
  
      alert("Consultation booked successfully!");
      console.log("Created Consultation:", data);
    } catch (error) {
      alert(error.message || "Error booking consultation.");
      console.error("Booking error:", error);
    }
  };
  
  
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!specialty) {
        setError("No specialty specified");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `http://localhost:8080/api/docteurs/search?${searchParams.toString()}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        if (response.status === 204) {
          setDoctors([]);
          setError(null);
          return;
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format from server");
        }

        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchParams, specialty]);

  const formatSearchCriteria = () => {
    let criteria = `${specialty || "All specialties"}`;
    if (city) {
      criteria += ` in ${city}`;
    }
    return criteria;
  };

  return (
    <div className="response-container">
      <div className="results-header">
        <Link to="/search" className="back-to-search">
          <ArrowLeft size={16} />
          Back to Search
        </Link>
        <h1>Doctor Search Results</h1>
        <p className="search-criteria">
          Showing results for: <strong>{formatSearchCriteria()}</strong>
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <Link to="/search" className="try-again-button">
            Try another search
          </Link>
        </div>
      ) : doctors.length === 0 ? (
        <div className="no-results">
          <h2>No doctors found</h2>
          <p>No doctors match your search criteria. Please try different filters.</p>
          <Link to="/search" className="try-again-button">
            Try another search
          </Link>
        </div>
      ) : (
        <div className="results-content">
          <div className="results-count">
            <h2>{doctors.length} Doctors Found</h2>
          </div>
          <div className="results-layout">
            <div className="doctors-list">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    <span>{doctor.prenom?.charAt(0) || "D"}</span>
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">
                      Dr. {doctor.nom} {doctor.prenom}
                    </h3>
                    <div className="doctor-specialty">
                      <span>{doctor.specialite}</span>
                      <div className="rating">
                        <Star size={16} className="star-icon" />
                        <span>{doctor.rating || "4.5"}</span>
                      </div>
                      <div className="consultations">
                        <Calendar size={16} />
                        <span>{doctor.nombreConsultations || 0} consultations</span>
                      </div>
                    </div>
                    <div className="doctor-location">
                      <div className="clinic">
                        <Building size={16} />
                        <span>{doctor.hopital || "Not specified"}</span>
                      </div>
                      <div className="address">
                        <MapPin size={16} />
                        <span>{doctor.city || "Not specified"}</span>
                      </div>
                      {doctor.telephone && (
                        <div className="phone">
                          <Phone size={16} />
                          <span>{doctor.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
  className="book-consultation"
  onClick={() => handleBookConsultation(doctor.id)}
>
  Book Consultation
</button>
                </div>
              ))}
            </div>
            <div className="map-container">
              {doctors[0]?.latitude && doctors[0]?.longitude ? (
                <div className="map-placeholder">
                  <h3>Map View</h3>
                  <p>Showing {doctors.length} doctors in {city || doctors[0].city || "Morocco"}</p>
                  {/* Future integration with Leaflet/Google Maps */}
                </div>
              ) : (
                <div className="map-placeholder">
                  <h3>Map View</h3>
                  <p>Location data not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2024 MedMaroc. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
