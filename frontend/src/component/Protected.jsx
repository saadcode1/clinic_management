import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "../axios.jsx"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./Protected.css"

const Protected = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [appointments, setAppointments] = useState([])

  // Decode token and set current user
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCurrentUser(decoded)
      } catch (error) {
        console.log("Error decoding token:", error)
      }
    }
  }, [])

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/get/appointment/all")
      setAppointments(res.data.response)
    } catch (err) {
      console.log("Error fetching appointments:", err.message)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments]) // Added fetchAppointments to dependencies

  // Function to update appointment status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Update UI instantly by setting the new status in state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status: newStatus } : appointment,
        ),
      )

      const res = await axios.put(`/update/appointment/${id}`, { status: newStatus })

      toast(res.data.message)

      // Fetch latest data to sync with backend
      fetchAppointments()
    } catch (err) {
      console.log("Error updating appointment:", err.message)
    }
  }

  return (
    <div className="protected-container">
      {currentUser && currentUser.name === "staff1" ? (
        <>
          <h2 className="welcome-message">Welcome, {currentUser.name}! You have access to manage appointments.</h2>

          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.user_id?.name}</td>
                  <td>{appointment.doctor?.name}</td>
                  <td>{appointment.time}</td>
                  <td className={`status-${appointment.status.toLowerCase()}`}>{appointment.status}</td>
                  <td>
                    {/* Hide buttons after selection */}
                    {appointment.status === "Pending" && (
                      <>
                        <button
                          className="action-button accept-button"
                          onClick={() => handleUpdateStatus(appointment._id, "Confirmed")}
                        >
                          Accept
                        </button>
                        <button
                          className="action-button cancel-button"
                          onClick={() => handleUpdateStatus(appointment._id, "Cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
        </>
      ) : (
        <h2 className="no-access-message">Sorry, you don't have access to this page!</h2>
      )}
    </div>
  )
}

export default Protected

