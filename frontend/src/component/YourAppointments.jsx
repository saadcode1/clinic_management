import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../axios.jsx"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./YourApp.css"

export default function YourAppointments() {
  const { id } = useParams()
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState("")

  const fetchAppointments = async (id) => {
    try {
      const res = await axios.get(`/get/user/appointments?id=${id}`)
      setAppointments(res.data.appointments)
    } catch (err) {
      console.log("Error while fetching user appointments:", err.message)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this appointment?")
    if (!confirmDelete) return

    try {
      const res = await axios.delete(`/delete/appointment/${appointmentId}`)
      setMessage(res.data.message)
      window.location.reload()
      alert("Appointment Deleted")
    } catch (err) {
      console.log("Error while cancelling the appointment:", err.message)
      setMessage("Failed to cancel the appointment. Please try again.")
    }
  }

  useEffect(() => {
    if (id) fetchAppointments(id)
  }, [id, fetchAppointments]) // Added fetchAppointments to dependencies

  return (
    <div className="appointments-page">
      <header className="header">
        <div className="container">
          <h1>Your Appointments</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {message && <div className="message success-message">{message}</div>}

          {appointments.length > 0 ? (
            <div className="appointments-grid">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="patient-details">
                    <h3>{appointment.user_id.name}</h3>
                    <p>Email: {appointment.user_id.email}</p>
                  </div>

                  <div className="doctor-details">
                    <h4>Doctor Details</h4>
                    <p>Dr. {appointment.doctor.name}</p>
                    <p>Specialization: {appointment.doctor.specialization}</p>
                    <p>Contact: {appointment.doctor.contact}</p>
                    <p>Availability: {appointment.doctor.availability.time}</p>
                  </div>

                  <div className="appointment-details">
                    <p>Date: {new Date(appointment.date).toDateString()}</p>
                    <p>Time: {appointment.time}</p>
                    <div className="status-and-action">
                      <p className={`status ${appointment.status.toLowerCase()}`}>Status: {appointment.status}</p>
                      <button onClick={() => handleCancelAppointment(appointment._id)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No appointments found.</p>
          )}
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}

