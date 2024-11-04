// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const nodemailer = require('nodemailer');
// const router = express.Router();

// // Email setup
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// router.post('/signup', async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;

//     try {
//         // Check if email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         const user = new User({ firstName, lastName, email, password: hashedPassword, otp });
//         await user.save();

//         // Send OTP via email
//         await transporter.sendMail({
//             to: email,
//             subject: 'OTP Verification',
//             text: `Your OTP is ${otp}`
//         });

//         res.status(201).json({ message: 'User created, OTP sent to email' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // // Signup Route
// // router.post('/signup', async (req, res) => {
// //     const { firstName, lastName, email, password } = req.body;

// //     try {
// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //         const user = new User({ firstName, lastName, email, password: hashedPassword, otp });
// //         await user.save();

// //         // Send OTP via email
// //         await transporter.sendMail({
// //             to: email,
// //             subject: 'OTP Verification',
// //             text: `Your OTP is ${otp}`
// //         });

// //         res.status(201).json({ message: 'User created, OTP sent to email' });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // OTP Verification Route
// router.post('/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user || user.otp !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         user.isVerified = true;
//         user.otp = null; // Clear OTP
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ message: 'OTP verified', token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user || !user.isVerified || !await bcrypt.compare(password, user.password)) {
//             return res.status(400).json({ message: 'Invalid credentials or user not verified' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();

console.log(process.env.EMAIL_PASSWORD, process.env.EMAIL)

// Email setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    port: 465,
    service: 'gmail'
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({ firstName, lastName, email, password: hashedPassword, otp });
        await user.save();

        // Send OTP via email
        const response = await transporter.sendMail({
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is ${otp}`
        });
        console.log({ response })

        res.status(201).json({ message: 'User created, OTP sent to email' });
    } catch (error) {
        console.log({ error })
        res.status(500).json({ error: error.message });
    }
});

// OTP Verification Route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.isVerified = true;
        user.otp = null; // Clear OTP
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'OTP verified', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.isVerified || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials or user not verified' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
