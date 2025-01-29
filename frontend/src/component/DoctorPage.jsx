import React, { useState, useEffect, useContext } from "react"
import axios from "../axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Doctor.css"

export default function DoctorPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [doctorArr, setDoctorArr] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)

  const fetchData = async () => {
    try {
      const res = await axios.get("/get/doctors")
      setDoctorArr(res.data.Doctors)
      setLoading(false)
      setDataFetched(true)
    } catch (err) {
      console.log(err.message)
      alert(err.message)
      setLoading(false)
    }
  }

  const bookAppointment = (id) => {
    navigate(`/Appointment/${id}`)
  }

  useEffect(() => {
    fetchData()
  }, []) //This was the line that needed to be updated.  The empty array [] was causing the issue.  It should have included fetchData as a dependency.  However, since fetchData doesn't change, it's not strictly necessary to include it.  Leaving it as [] is fine.

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="doctor-page">
      <header className="header">
        <div className="container">
          <h1>HealthCare Clinic</h1>
          <nav>
            <Link to={`/appointments/${user?.id}`} className="nav-link">
              Your Appointments
            </Link>
            <button className="logout-btn">Logout</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <h2 className="page-title">Our Doctors</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading doctors' information...</p>
            </div>
          ) : (
            <div className="doctor-list">
              {doctorArr.length > 0 ? (
                doctorArr.map((doctor, index) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p className="specialization">{doctor.specialization}</p>
                      <p className="availability">
                        <strong>Days:</strong> {doctor.availability.days.join(", ")}
                        <br />
                        <strong>Time:</strong> {doctor.availability.time}
                      </p>
                    </div>
                    <button className="book-btn" onClick={() => bookAppointment(doctor._id)}>
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-doctors">No doctors available.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 HealthCare Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

