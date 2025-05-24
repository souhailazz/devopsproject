import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import HealthcareSearch from './components/Search/healthcare-search';
import ResponseSearch from './components/ResponseSearch/ResponseSearch';
import Signup from './components/Signup/Signup';
import LoginForm from './components/Login/Login';
import MyConsultation from './components/MyConsultation/MyConsultation';

// Home component
const Home = () => (
  <div className="home-container">
    <h1>MedMaroc Healthcare Platform</h1>
    <p className="description">Find and connect with healthcare professionals across Morocco</p>
    <div className="cta-buttons">
      <Link to="/search" className="primary-btn">Find Doctors</Link>
      <Link to="/about" className="secondary-btn">Learn More</Link>
    </div>
  </div>
);

// About component
const About = () => (
  <div className="about-container">
    <h1>About MedMaroc</h1>
    <p>MedMaroc is a modern healthcare platform designed to connect patients with qualified medical professionals across Morocco.</p>
    <p>Our mission is to improve healthcare accessibility for all citizens by providing an easy-to-use platform for finding specialists in your area.</p>
    <Link to="/" className="back-link">Return to Home</Link>
  </div>
);

// NotFound component
const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="back-link">Return to Home</Link>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setIsLoggedIn(!!storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="logo-container">
            <Link to="/" className="logo-link">MedMaroc</Link>
          </div>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/search">Find Doctors</Link>
            <Link to="/MyConsultation">Consultation</Link>
            <Link to="/about">About</Link>
            {!isLoggedIn ? (
              <Link to="/Login">Login</Link>
            ) : (
              <button onClick={handleLogout} className="logout-button">Logout</button>
            )}
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<HealthcareSearch />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/response-search" element={<ResponseSearch />} />
            <Route path="/MyConsultation" element={<MyConsultation />} />
            <Route path="/about" element={<About />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
