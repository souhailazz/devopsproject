"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./Login.css"
import { Navigate, useNavigate } from "react-router-dom"

function LoginForm() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState("patient")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    numeroProfessionnel: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url =
        userType === "patient"
          ? "http://localhost:8080/api/patients/login"
          : "http://localhost:8080/api/docteurs/login"

      const payload =
        userType === "patient"
          ? {
              email: formData.email,
              motDePasse: formData.password,
            }
          : {
              numeroProfessionnel: formData.numeroProfessionnel,
              motDePasse: formData.password,
            }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Login Response Data:", data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      localStorage.setItem("userId", parseInt(data.id, 10))
      localStorage.setItem("userType", userType)
      
      console.log("Stored User Data:", {
        userId: localStorage.getItem("userId"),
        userType: localStorage.getItem("userType")
      })

      toast.success("Login successful!", { 
        autoClose: 1500,
        onClose: () => {
          navigate("/search")
        }
      })
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed. Please check your credentials.", { autoClose: 1500 })
    }
  }

  return (
    <div className="login-container">
      <ToastContainer />
      <h1 className="login-title">Login</h1>
      <p className="login-subtitle">
        Enter your {userType === "patient" ? "email" : "professional number"} and password to access your account
      </p>

      <div className="user-type-toggle">
        <button
          type="button"
          onClick={() => setUserType("patient")}
          className={`toggle-btn ${userType === "patient" ? "active" : ""}`}
        >
          Patient
        </button>
        <button
          type="button"
          onClick={() => setUserType("docteur")}
          className={`toggle-btn ${userType === "docteur" ? "active" : ""}`}
        >
          Docteur
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {userType === "patient" ? (
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              className="form-input"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="numeroProfessionnel" className="form-label">
              Numéro Professionnel
            </label>
            <input
              type="text"
              id="numeroProfessionnel"
              name="numeroProfessionnel"
              value={formData.numeroProfessionnel}
              onChange={handleChange}
              placeholder="123456789"
              className="form-input"
              required
            />
          </div>
        )}

        <div className="form-group">
          <div className="password-header">
            <label htmlFor="password" className="form-label">
              Password
            </label>
           
          </div>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
              {showPassword ? (
                <i className="eye-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </i>
              ) : (
                <i className="eye-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </i>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="signup-text">
        Don't have an account?{" "}
        <a href="/signup" className="signup-link">
          Sign up
        </a>
      </p>
    </div>
  )
}

export default LoginForm
