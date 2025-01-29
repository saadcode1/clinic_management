import axios from "../axios"
import React, { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"
import "./Appointment.css"

export default function Appointment() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [appointments, setAppointments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [message, setMessage] = useState("")

  const fetchDoctor = async (doctorId) => {
    try {
      const res = await axios.get(`/get/doctor/details?id=${doctorId}`)
      setDoctor(res.data.doctor)
      const res2 = await axios.get(`/get/appointments/details?id=${doctorId}`)
      setAppointments(res2.data.appointments)
    } catch (err) {
      console.error("Error fetching doctor details:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentBooking = async (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      setMessage("Please select a valid date and time.")
      return
    }

    try {
      const res = await axios.post(`/post/appointment/book`, {
        user_id: user.id,
        doctor: id,
        date: selectedDate,
        time: selectedTime,
      })
      setMessage(res.data.message || "Appointment booked successfully!")
    } catch (err) {
      setMessage("Failed to book appointment. Please try again.")
    }
  }

  useEffect(() => {
    fetchDoctor(id)
  }, [id])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!doctor) {
    return <div className="error">Doctor details not found.</div>
  }

  return (
    <div className="appointment-page">
      <h1>Appointment Booking</h1>
      <p>Booking appointment for Dr. {doctor.name}</p>

      <div className="doctor-details">
        <h2>Doctor Details</h2>
        <p>
          <strong>Name:</strong> {doctor.name}
        </p>
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p>
          <strong>Contact:</strong> {doctor.contact}
        </p>
        <p>
          <strong>Availability:</strong>
        </p>
        <ul>
          {doctor.availability?.days.map((day, index) => (
            <li key={index}>{day}</li>
          ))}
        </ul>
        <p>
          <strong>Timings:</strong> {doctor.availability?.time}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(doctor.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="booking-form">
        <h2>Book an Appointment</h2>
        <form onSubmit={handleAppointmentBooking}>
          <div className="form-group">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Select Time:</label>
            <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="">-- Select Time --</option>
              {doctor.availability?.time
                .split("-")
                .map((time) => time.trim())
                .map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
            </select>
          </div>

          <button type="submit" className="book-btn">
            Book Appointment
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      {appointments && (
        <div className="existing-appointments">
          <h3>Existing Appointments:</h3>
          {appointments.map((appointment, index) => (
            <div key={index} className="appointment-item">
              <p>
                <strong>Date:</strong> {appointment.date}
              </p>
              <p>
                <strong>Time:</strong> {appointment.time}
              </p>
              <p>
                <strong>Status:</strong> {appointment.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

