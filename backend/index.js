import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const PORT=process.env.PORT || 6000;
const app=express();
import routerUser from './routes/userRoute.js';

app.use(cors());
// Use body-parser to parse JSON bodies
app.use(bodyParser.json());
// Use body-parser to parse URL-encoded data (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",routerUser);



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        // Drop the problematic index if it exists
        mongoose.connection.collection('users').dropIndex('contact_1')
            .then(() => {
                console.log("Dropped index 'contact_1' from users collection.");
            })
            .catch(err => {
                console.log("Index 'contact_1' doesn't exist or couldn't be dropped:", err.message);
            });



        console.log('MongoDB connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
.catch(err => console.error('Database connection error:', err));


