const User = require('../models/User');
const { sendOTPEmail, sendConfirmationEmail, sendNotificationEmail } = require('../services/emailService');
const { generateOTP, storeOTP, verifyOTP } = require('../services/otpService');

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone is valid
 */
const isValidPhone = (phone) => {
    // Allow digits, spaces, dashes, and parentheses
    // Must have at least 10 digits
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * Sanitizes input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    // Basic sanitization - replace < and > with HTML entities
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
};

/**
 * Handles form submission and OTP generation
 */
const submitForm = async (req, res) => {
    console.log('Form submission received:', req.body);
    const { name, email, phone, subject, message } = req.body;

    try {
        // Validate inputs
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate phone format
        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: email.toLowerCase().trim(),
            phone: sanitizeInput(phone),
            subject: sanitizeInput(subject),
            message: sanitizeInput(message)
        };

        // Generate and store OTP
        const otp = generateOTP();
        console.log(`Generated OTP ${otp} for ${sanitizedData.email}`);
        await storeOTP(sanitizedData.email, otp);
        console.log(`Stored OTP for ${sanitizedData.email}`);

        // Send OTP to user's email
        const emailSent = await sendOTPEmail(sanitizedData.email, otp);
        console.log(`OTP email sent status: ${emailSent}`);

        if (!emailSent) {
            console.log('Failed to send OTP email');
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        res.status(202).json({ message: 'OTP_REQUIRED' });
    } catch (error) {
        console.error('Error in submitForm:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Verifies OTP and saves user data
 */
const verifyAndSave = async (req, res) => {
    console.log('OTP verification received:', req.body);
    const { name, email, phone, subject, message, otp } = req.body;

    try {
        // Validate inputs
        if (!name || !email || !phone || !subject || !message || !otp) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate phone format
        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: email.toLowerCase().trim(),
            phone: sanitizeInput(phone),
            subject: sanitizeInput(subject),
            message: sanitizeInput(message),
            otp: otp.trim()
        };

        // Verify OTP
        console.log(`Verifying OTP ${sanitizedData.otp} for ${sanitizedData.email}`);
        const isOTPValid = await verifyOTP(sanitizedData.email, sanitizedData.otp);
        console.log(`OTP validation result: ${isOTPValid}`);

        if (!isOTPValid) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Save user data
        console.log(`Saving user data for ${sanitizedData.email}`);
        const user = new User({
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            subject: sanitizedData.subject,
            message: sanitizedData.message,
            isVerified: true,
            createdAt: new Date() // Add timestamp
        });

        await user.save();
        console.log(`User data saved for ${sanitizedData.email}`);

        // Send confirmation email to user
        const confirmationSent = await sendConfirmationEmail(sanitizedData.email);
        console.log(`Confirmation email sent status: ${confirmationSent}`);

        // Send notification email to admin
        const notificationMessage = `
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}
Subject: ${sanitizedData.subject}
Message: ${sanitizedData.message}
Timestamp: ${new Date().toLocaleString()}
        `;
        const notificationSent = await sendNotificationEmail(notificationMessage);
        console.log(`Notification email sent status: ${notificationSent}`);

        // Return success even if emails fail - data is already saved
        res.status(200).json({ message: 'Data saved successfully.' });
    } catch (error) {
        console.error('Error in verifyAndSave:', error);

        // Check for MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This submission has already been recorded.' });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { submitForm, verifyAndSave };