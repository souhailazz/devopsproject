import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './DoctorMap.css';

const DoctorMap = ({ doctors, onDoctorSelect }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 36.8065, lng: 10.1815 }); // Default to Tunisia center
  const [mapError, setMapError] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);

  console.log('DoctorMap received doctors:', doctors);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userLoc);
          setMapCenter(userLoc); // Center map on user's location
        },
        (error) => {
          console.error('Error getting location:', error);
          // If location access fails, use default center
          setMapCenter({ lat: 36.8065, lng: 10.1815 });
        }
      );
    }
  }, []);

  // Calculate distances and find nearby doctors
  useEffect(() => {
    if (userLocation && doctors && doctors.length > 0) {
      const doctorsWithDistance = doctors.map(doctor => {
        if (!doctor.latitude || !doctor.longitude) return null;
        
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(doctor.latitude),
          parseFloat(doctor.longitude)
        );
        
        return {
          ...doctor,
          distance
        };
      }).filter(Boolean);

      // Sort doctors by distance
      const sortedDoctors = doctorsWithDistance.sort((a, b) => a.distance - b.distance);
      setNearbyDoctors(sortedDoctors);
    }
  }, [userLocation, doctors]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const handleMarkerClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleInfoWindowClose = () => {
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctor) => {
    if (onDoctorSelect) {
      onDoctorSelect(doctor);
    }
  };

  const handleApiLoad = () => {
    setIsApiLoaded(true);
  };

  const handleApiError = (error) => {
    console.error('Google Maps API Error:', error);
    setMapError('Failed to load Google Maps. Please check your API key configuration.');
  };

  // Custom marker icon with doctor's initial and distance indicator
  const createMarkerIcon = useCallback((doctor, index) => {
    if (!isApiLoaded) return null;
    
    // Use different colors for nearby doctors
    const isNearby = doctor.distance <= 5; // Within 5km
    const fillColor = isNearby ? '#10b981' : '#6b7280';
    
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: fillColor,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 12,
      label: {
        text: `${index + 1}`,
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    };
  }, [isApiLoaded]);

  if (mapError) {
    return <div className="map-error">{mapError}</div>;
  }

  return (
    <div className="doctor-map-container">
      <LoadScript 
        googleMapsApiKey="AIzaSyAQlyaR2Dr0fJPTPk3otltkPnyRekZCPpg"
        onLoad={handleApiLoad}
        onError={handleApiError}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
          onError={(error) => {
            console.error('Google Maps error:', error);
            setMapError('Failed to load map');
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8
              }}
            />
          )}

          {/* Doctor markers */}
          {isApiLoaded && nearbyDoctors.map((doctor, index) => {
            if (!doctor.latitude || !doctor.longitude) {
              console.warn('Doctor missing coordinates:', doctor);
              return null;
            }
            return (
              <Marker
                key={doctor.id}
                position={{ 
                  lat: parseFloat(doctor.latitude), 
                  lng: parseFloat(doctor.longitude) 
                }}
                onClick={() => handleMarkerClick(doctor)}
                icon={createMarkerIcon(doctor, index)}
              />
            );
          })}

          {selectedDoctor && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedDoctor.latitude), 
                lng: parseFloat(selectedDoctor.longitude) 
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="info-window">
                <h3>Dr. {selectedDoctor.prenom} {selectedDoctor.nom}</h3>
                <p><strong>Specialty:</strong> {selectedDoctor.specialite}</p>
                <p><strong>Hospital:</strong> {selectedDoctor.hopital}</p>
                <p><strong>City:</strong> {selectedDoctor.city}</p>
                <p><strong>Rating:</strong> {selectedDoctor.rating}/5</p>
                <p><strong>Consultations:</strong> {selectedDoctor.nombreConsultations}</p>
                {selectedDoctor.distance && (
                  <p><strong>Distance:</strong> {selectedDoctor.distance.toFixed(1)} km</p>
                )}
                {selectedDoctor.telephone && (
                  <p><strong>Phone:</strong> {selectedDoctor.telephone}</p>
                )}
                <button 
                  className="select-doctor-btn"
                  onClick={() => handleDoctorSelect(selectedDoctor)}
                >
                  Book Consultation
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default DoctorMap; 