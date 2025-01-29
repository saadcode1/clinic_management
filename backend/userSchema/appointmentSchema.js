import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the Patient model
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // References the Doctor model
        required: true,
    },
    date: {
        type: Date, // Date of the appointment
        required: true,
    },
    time: {
        type: String, // Time of the appointment (e.g., '10:30 AM')
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled',], // Appointment status
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
