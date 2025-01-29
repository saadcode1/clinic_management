import mongoose from "mongoose";
import Doctor from '../userSchema/docterSchema.js';
import doctorsData from './doctorsData.js';
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect("mongodb+srv://mdshaadnizami:ZyUVFPhlHiRdIyqx@cluster0.cxfke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        // Drop the problematic index if it exists
        mongoose.connection.collection('users').dropIndex('contact_1')
            .then(() => {
                console.log("Dropped index 'contact_1' from users collection.");
            })
            .catch(err => {
                console.log("Index 'contact_1' doesn't exist or couldn't be dropped:", err.message);
            });
    })
.catch(err => console.error('Database connection error:', err));


const insertFunc= async ()=>{
      const data=await Doctor.insertMany(doctorsData)
      console.log(data);
}

insertFunc();