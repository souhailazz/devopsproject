"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Search/healthcare-search.css";

export default function HealthcareSearch() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!specialty) {
      setError("Please select a specialty");
      return;
    }

    // Build the query params
    const params = new URLSearchParams();
    params.append('specialite', specialty);
    if (city) {
      params.append('city', city);
    }

    // Navigate to the response search page with the query parameters
    navigate(`/response-search?${params.toString()}`);
  };

  return (
    <div className="healthcare-container">
      <div className="search-section">
        <h1>Search for Doctors</h1>

        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="select-input"
            >
               <option value="">Select city</option>
  <option value="casablanca">Casablanca</option>
  <option value="rabat">Rabat</option>
  <option value="fes">Fès</option>
  <option value="marrakech">Marrakech</option>
  <option value="tangier">Tanger</option>
  <option value="agadir">Agadir</option>
  <option value="meknes">Meknès</option>
  <option value="oujda">Oujda</option>
  <option value="kenitra">Kénitra</option>
  <option value="tetouan">Tétouan</option>
  <option value="safi">Safi</option>
  <option value="el-jadida">El Jadida</option>
  <option value="beni-mellal">Béni Mellal</option>
  <option value="nador">Nador</option>
  <option value="taza">Taza</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="select-input"
            >
             <option value="">Select specialty</option>
  <option value="Cardiologie">Cardiologie</option>
  <option value="Dermatologie">Dermatologie</option>
  <option value="Neurologie">Neurologie</option>
  <option value="Orthopedie">Orthopedie</option>
  <option value="Pediatrice">Pediatrice</option>
  <option value="Psychiatre">Psychiatre</option>
  <option value="Medecin General">Medecin General</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            <Search size={18} />
            Search
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Healthcare Section */}
      <div className="healthcare-section">
        <h2>Healthcare in Morocco</h2>

        <div className="healthcare-cards">
          <div className="healthcare-card">
            <h3>Public Healthcare</h3>
            <p>
              Morocco's public healthcare system provides basic medical services
              to citizens through a network of hospitals and clinics across the
              country.
            </p>
          </div>

          <div className="healthcare-card">
            <h3>Private Healthcare</h3>
            <p>
              Private healthcare facilities in Morocco offer higher quality
              services with shorter waiting times, modern equipment, and
              specialized care.
            </p>
          </div>

          <div className="healthcare-card">
            <h3>Medical Tourism</h3>
            <p>
              Morocco is becoming a popular destination for medical tourism,
              offering quality healthcare services at competitive prices.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">
        <h2>Healthcare Statistics</h2>

        <div className="statistics-cards">
          <div className="statistic-card">
            <h3 className="statistic-number green">23,000+</h3>
            <p className="statistic-label">Registered Doctors</p>
          </div>

          <div className="statistic-card">
            <h3 className="statistic-number green">150+</h3>
            <p className="statistic-label">Hospitals</p>
          </div>

          <div className="statistic-card">
            <h3 className="statistic-number green">35+</h3>
            <p className="statistic-label">Medical Specialties</p>
          </div>

          <div className="statistic-card">
            <h3 className="statistic-number green">12</h3>
            <p className="statistic-label">Major Medical Cities</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
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