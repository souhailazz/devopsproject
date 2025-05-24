import { useState } from 'react';
import "./Signup.css";

export default function Signup() {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form data with all possible fields for both doctor and patient
  const [formData, setFormData] = useState({
    // Common fields
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    adresse: '',
    ville: '',
    
    // Patient specific fields
    dateNaissance: '',
    numeroSecuriteSociale: '',
    historiqueMedical: '',
    
    // Doctor specific fields
    numeroProfessionnel: '',  // Changed from numeroIdentification to match database column name
    specialite: '',
    hopital: '',
    city: ''  // Add city field for doctors
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields based on user type
      if (userType === 'doctor' && !formData.numeroProfessionnel) {
        throw new Error('Professional Number is required for doctor registration');
      }
      
      // Validate that city is selected
      if (!formData.ville && !formData.city) {
        throw new Error('Please select a city');
      }
      
      // Determine which API endpoint to use based on user type
      const endpoint = userType === 'patient' 
        ? 'http://localhost:8080/api/patients'
        : 'http://localhost:8080/api/docteurs';
      
      // Create a payload with only the relevant fields for the user type
      const payload = { ...formData };
      
      // Remove fields that aren't needed for the current user type
      if (userType === 'patient') {
        delete payload.numeroProfessionnel;
        delete payload.specialite;
        delete payload.hopital;
        delete payload.city;
      } else {
        delete payload.dateNaissance;
        delete payload.numeroSecuriteSociale;
        delete payload.historiqueMedical;
        delete payload.ville;
        // Ensure city is properly set for doctors
        if (formData.ville) {
          payload.city = formData.ville;
        }
      }
      
      console.log('Submitting data:', payload);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `${userType === 'patient' ? 'Patient' : 'Doctor'} signup failed. Please check your information.`
        );
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create an account</h1>
      <p className="signup-subtitle">Enter your information to create your account</p>
      
      {/* User Type Selection */}
      <div className="user-type-container">
        <button
          type="button"
          className={`user-type-btn doctor-btn ${userType === 'doctor' ? 'active' : ''}`}
          onClick={() => setUserType('doctor')}
        >
          I am a Doctor
        </button>
        <button
          type="button"
          className={`user-type-btn patient-btn ${userType === 'patient' ? 'active' : ''}`}
          onClick={() => setUserType('patient')}
        >
          I am a Patient
        </button>
      </div>

      {success ? (
        <div className="success-message">
          {userType === 'patient' ? 'Patient' : 'Doctor'} account created successfully! You can now login.
          <div className="login-link-container">
            <a href="/login" className="login-link">Go to Login</a>
          </div>
        </div>
      ) : (
        <div className="signup-form">
          <div className="name-fields-container">
            {/* First Name */}
            <div className="form-group first-name-container">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="form-input first-name-input"
                placeholder="First name"
                required
              />
            </div>
            
            {/* Last Name */}
            <div className="form-group last-name-container">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="form-input last-name-input"
                placeholder="Last name"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="form-group email-container">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input email-input"
              placeholder="you@example.com"
              required
            />
          </div>
          
          {/* Password */}
          <div className="form-group password-container">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className="form-input password-input"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          {/* Phone */}
          <div className="form-group phone-container">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="form-input phone-input"
              placeholder="Phone number"
            />
          </div>
          
          {/* Address */}
          <div className="form-group address-container">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="form-input address-input"
              placeholder="Your address"
            />
          </div>
          
          {/* City */}
          <div className="form-group city-container">
            <label className="form-label">City</label>
            <div className="city-select-wrapper">
              <select 
                className="form-select city-select"
                name={userType === 'patient' ? 'ville' : 'city'}
                value={userType === 'patient' ? formData.ville : formData.city}
                onChange={handleChange}
                required
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
          </div>
          
          {/* Conditional fields based on user type */}
          {userType === 'patient' ? (
            // Patient specific fields
            <>
              {/* Birth Date */}
              <div className="form-group birthdate-container">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="form-input birthdate-input"
                />
              </div>
              
              {/* Social Security Number */}
              <div className="form-group ssn-container">
                <label className="form-label">Social Security Number</label>
                <input
                  type="text"
                  name="numeroSecuriteSociale"
                  value={formData.numeroSecuriteSociale}
                  onChange={handleChange}
                  className="form-input ssn-input"
                  placeholder="Social security number"
                />
              </div>
              
              {/* Medical History */}
              <div className="form-group medical-history-container">
                <label className="form-label">Medical History</label>
                <textarea
                  name="historiqueMedical"
                  value={formData.historiqueMedical}
                  onChange={handleChange}
                  className="form-textarea medical-history-input"
                  rows="3"
                  placeholder="Any relevant medical history"
                ></textarea>
              </div>
            </>
          ) : (
            // Doctor specific fields
            <>
              {/* Professional Number */}
              <div className="form-group professional-number-container">
                <label className="form-label">Professional Number (Numéro Professionnel)</label>
                <input
                  type="text"
                  name="numeroProfessionnel"
                  value={formData.numeroProfessionnel}
                  onChange={handleChange}
                  className="form-input professional-number-input"
                  placeholder="e.g. 12345678"
                  required
                />
              </div>
              
              {/* Specialty */}
              <div className="form-group specialty-container">
                <label className="form-label">Specialty (Spécialité)</label>
                <select
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  className="form-select specialty-select"
                  required
                >
                  <option value="">Select specialty</option>
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Dermatologie">Dermatologie</option>
                  <option value="Neurologie">Neurologie</option>
                  <option value="Orthopedie">Orthopedie</option>
                  <option value="Pediatrice">Pediatrice</option>
                  <option value="Psychiatre">Psychiatre</option>
                  <option value="Medecin General">Medecin General </option>
                </select>
              </div>
              
              {/* Hospital */}
              <div className="form-group hospital-container">
  <label className="form-label">Hospital (Hôpital)</label>
  <select
    name="hopital"
    value={formData.hopital}
    onChange={handleChange}
    className="form-select hospital-select"
  >
    <option value="">Select hospital</option>

    <optgroup label="Casablanca">
      <option value="chu-ibn-rochd-casablanca">CHU Ibn Rochd</option>
      <option value="hopital-cheikh-khalifa-casablanca">Hôpital Cheikh Khalifa</option>
      <option value="hopital-20-aout-casablanca">Hôpital 20 Août</option>
      <option value="hopital-abdelatif-bni-hamdane-casablanca">Hôpital Abdelatif Bni Hamdane</option>
      <option value="clinique-anfa-casablanca">Clinique Anfa</option>
    </optgroup>

    <optgroup label="Rabat">
      <option value="chu-ibn-sina-rabat">CHU Ibn Sina</option>
      <option value="hopital-moulay-youssef-rabat">Hôpital Moulay Youssef</option>
      <option value="hopital-militaire-mohammed-v-rabat">Hôpital Militaire Mohammed V</option>
      <option value="hopital-pediatrique-rabat">Hôpital d’Enfants</option>
      <option value="clinique-agdal-rabat">Clinique Agdal</option>
    </optgroup>

    <optgroup label="Fès">
      <option value="chu-hassan-ii-fes">CHU Hassan II</option>
      <option value="hopital-ghassani-fes">Hôpital El Ghassani</option>
      <option value="clinique-atlas-fes">Clinique Atlas</option>
    </optgroup>

    <optgroup label="Marrakech">
      <option value="chu-mohammed-vi-marrakech">CHU Mohammed VI</option>
      <option value="hopital-ibn-tofail-marrakech">Hôpital Ibn Tofail</option>
    </optgroup>

    <optgroup label="Tanger">
      <option value="chu-mohammed-vi-tanger">CHU Mohammed VI</option>
      <option value="hopital-regional-tanger">Hôpital Régional</option>
    </optgroup>

    <optgroup label="Agadir">
      <option value="hopital-hassan-ii-agadir">Hôpital Hassan II</option>
      <option value="chu-agadir">CHU Agadir</option>
    </optgroup>

    <optgroup label="Meknès">
      <option value="hopital-mohammed-v-meknes">Hôpital Mohammed V</option>
    </optgroup>

    <optgroup label="Oujda">
      <option value="chu-oujda">CHU Mohammed VI</option>
      <option value="hopital-el-farabi-oujda">Hôpital Al Farabi</option>
    </optgroup>

    <optgroup label="Kénitra">
      <option value="hopital-el-idrissi-kenitra">Hôpital El Idrissi</option>
    </optgroup>

    <optgroup label="Tétouan">
      <option value="hopital-saniat-ramel-tetouan">Hôpital Saniat Rmel</option>
    </optgroup>

    <optgroup label="Safi">
      <option value="hopital-mohammed-v-safi">Hôpital Mohammed V</option>
    </optgroup>

    <optgroup label="El Jadida">
      <option value="hopital-mohammed-v-eljadida">Hôpital Mohammed V</option>
    </optgroup>

    <optgroup label="Béni Mellal">
      <option value="hopital-regional-beni-mellal">Hôpital Régional</option>
    </optgroup>

    <optgroup label="Nador">
      <option value="hopital-hassani-nador">Hôpital El Hassani</option>
    </optgroup>

    <optgroup label="Taza">
      <option value="hopital-ibn-baja-taza">Hôpital Ibn Baja</option>
    </optgroup>
  </select>
</div>

            </>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          
          {/* Login Link */}
          <p className="login-prompt">
            Already have an account? 
            <a href="/login" className="login-link"> Login</a>
          </p>
        </div>
      )}
    </div>
  );
}