import React, { useState, useContext } from "react"
import axios from "../axios"
import { AuthContext } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/login", formData)
      console.log(response)
      login(response.data.token)
      navigate("/doctorsList")
    } catch (error) {
      alert(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Our Clinic</h2>
        <p>Please log in to book your appointment</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

