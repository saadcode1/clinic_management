import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../userSchema/user.js';
import Doctor from "../userSchema/docterSchema.js"
import dotenv, { populate } from 'dotenv';
import Appointment from '../userSchema/appointmentSchema.js';
dotenv.config();
const routerUser = express.Router();

// Register Route
routerUser.post('/register', async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
        
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Save new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
});

// Login Route
routerUser.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, name: user.name, email:user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful.',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
// Corrected Protected Route
routerUser.get('/protected', (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.name}!` });
});





routerUser.get("/get/doctors", async (req,res)=>{
    try{
           const result=await Doctor.find({});

           res.status(201).json({Doctors:result});
    }catch(err){

    }
           
})



routerUser.get("/get/doctor/details", async (req, res) => {
    try {
        const { id } = req.query; // Use query parameters for GET requests
        console.log("Doctor ID:", id);
        
        if (!id) {
            return res.status(400).json({ message: "Doctor ID is required." });
        }

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        res.status(200).json({ doctor });
    } catch (err) {
        console.log("Error while fetching doctor details:", err.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


routerUser.post("/post/appointment/book",async (req,res)=>{

    try{

          
          //    const {user_id,doctorId,date,time}=req.body;
          const saveData=new Appointment(req.body);
        
          saveData.save();

          if(saveData){
            return res.status(201).json({message :"Appointment Submitted!"})
          }
          
    }catch(err){
        console.log("error while saving data into appointments models",err.message)
        res.json({msg:err.message});
    }
          



})



routerUser.get("/get/appointments/details", async (req, res) => {
    try {
        const { id } = req.query; // Use query parameters for GET requests

        console.log("Doctor ID:", id);
        
        if (!id) {
            return res.status(400).json({ message: "Doctor ID is required." });
        }

        // Querying based on doctor's ID, assuming doctor field stores the ObjectId
        const appointments = await Appointment.find({ "doctor": id });

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "Appointments not found." });
        }

        res.status(200).json({ appointments });
    } catch (err) {
        console.log("Error while fetching doctor details:", err.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});



routerUser.get("/get/user/appointments", async (req, res) => {
    try {
        const { id } = req.query; // Use query parameters for GET requests

        console.log("User ID:", id);
        
        if (!id) {
            return res.status(400).json({ message: "user ID is required." });
        }

        // Querying based on doctor's ID, assuming doctor field stores the ObjectId
        const appointments = await Appointment.find({ "user_id": id }).populate("user_id").populate("doctor")

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "Appointments not found." });
        }

        res.status(200).json({ appointments });
    } catch (err) {
        console.log("Error while fetching user appointments details:", err.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


routerUser.delete("/delete/appointment/:id",async (req,res)=>{
    try{
        const {id}=req.params;
        const response=await Appointment.findByIdAndDelete(id)

        res.status(201).json({message:"appointments was successfully deleted "})
    }catch(err){
          console.log("error while deleting data from appointments",err.message)
    }
          
})



routerUser.get("/get/appointment/all",async(req,res)=>{
           
    try{
        const response = await Appointment.find({})
        .populate("user_id") // Ensure the field name is a string
        .populate("doctor"); // Ensure the field name is a string
    

               if(!response){
               return res.status(501).json({message:"appointments is not available"})
               }


               res.status(201).json({response});


    }catch(err){
        console.log("error while fetching appointments",err.message);
    }
})



routerUser.put("/update/appointment/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({ message: "Appointment status updated successfully.", updatedAppointment });
    } catch (err) {
        console.log("Error while updating appointment status:", err.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});





export default routerUser;