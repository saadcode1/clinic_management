import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../userSchema/user.js';
import dotenv from 'dotenv';
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

// Protected Route Example
routerUser.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.name}!` });
});

// Token Verification Middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

export default routerUser;