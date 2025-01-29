import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    availability: {
        days: {
            type: [String], // Array of strings (e.g., ['Monday', 'Tuesday'])
            required: true
        },
        time: {
            type: String, // Time range as a string (e.g., '9:00 AM - 1:00 PM')
            required: true
        }
    },
    contact: {
        type: String, // Email or contact info
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const  Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
