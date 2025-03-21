const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure dotenv is loaded

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// OTP Email Transporter - Pool keeps connections alive for faster sending
const otpTransporter = nodemailer.createTransport({
    pool: true, // Use connection pool for better performance
    maxConnections: 5, // Maximum number of connections to pool
    maxMessages: 100, // Maximum number of messages per connection
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'), // Changed from 465 to 587
    secure: false, // Changed from true to false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Only enable debug in development
    debug: !isProduction,
    logger: !isProduction,
    // Add TLS options to fix SSL issues
    tls: {
        rejectUnauthorized: false // Allows self-signed certificates
    }
});

// Notification Email Transporter - Pool keeps connections alive for faster sending
const notificationTransporter = nodemailer.createTransport({
    pool: true, // Use connection pool for better performance
    maxConnections: 5, // Maximum number of connections to pool
    maxMessages: 100, // Maximum number of messages per connection
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'), // Changed from 465 to 587
    secure: false, // Changed from true to false for port 587
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_EMAIL_PASS
    },
    // Only enable debug in development
    debug: !isProduction,
    logger: !isProduction,
    // Add TLS options to fix SSL issues
    tls: {
        rejectUnauthorized: false // Allows self-signed certificates
    }
});

// Test the connections
otpTransporter.verify(function(error, success) {
    if (error) {
        console.log('OTP transporter error:', error);
    } else {
        console.log('OTP transporter is ready to send messages');
    }
});

notificationTransporter.verify(function(error, success) {
    if (error) {
        console.log('Notification transporter error:', error);
    } else {
        console.log('Notification transporter is ready to send messages');
        // Only send test notification in development
        if (!isProduction) {
            sendTestNotification();
        }
    }
});

// Send a test notification on startup (development only)
const sendTestNotification = async () => {
    try {
        const info = await notificationTransporter.sendMail({
            from: `"LinkUp System" <${process.env.NOTIFICATION_EMAIL}>`,
            to: process.env.PERSONAL_EMAIL,
            subject: 'LinkUp System Started',
            text: `The LinkUp system has started at ${new Date().toLocaleString()}. This is a test notification to verify your email is working.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">LinkUp System Started</h2>
                    <p>Hello,</p>
                    <p>The LinkUp system has started at ${new Date().toLocaleString()}.</p>
                    <p>This is a test notification to verify your email is working.</p>
                    <p>Regards,<br>LinkUp System</p>
                </div>
            `
        });
        console.log(`Test notification email sent to ${process.env.PERSONAL_EMAIL.substring(0, 3)}***`);
    } catch (error) {
        console.error('Error sending test notification email:', error);
    }
};

/**
 * Safely logs email addresses by masking most characters
 * @param {string} email - Email address to mask
 * @returns {string} - Masked email address
 */
const maskEmail = (email) => {
    if (!email || typeof email !== 'string') return '***';
    const [username, domain] = email.split('@');
    if (!username || !domain) return '***';
    
    const maskedUsername = username.length > 2 
        ? `${username.substring(0, 2)}${'*'.repeat(username.length - 2)}`
        : username[0] + '*';
        
    const domainParts = domain.split('.');
    const maskedDomain = domainParts.length > 1
        ? `${'*'.repeat(domainParts[0].length)}@${domainParts.join('.')}`
        : `*@${domain}`;
        
    return maskedUsername + maskedDomain;
};

// Send OTP Email
const sendOTPEmail = async (to, otp) => {
    console.log(`Attempting to send OTP to ${maskEmail(to)}`);
    
    try {
        const info = await otpTransporter.sendMail({
            from: `"LinkUp Contact Form" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Your OTP Verification Code',
            priority: 'high', // Mark as high priority for faster delivery
            text: `Hello,\n\nYour One-Time Password (OTP) for LinkUp contact form verification is: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this code, please ignore this email.\n\nRegards,\nLinkUp Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">LinkUp Verification</h2>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) for LinkUp contact form verification is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</span>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p>Regards,<br>LinkUp Team</p>
                </div>
            `
        });
        
        console.log(`OTP email sent to ${maskEmail(to)}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

// Send Confirmation Email to User
const sendConfirmationEmail = async (to) => {
    console.log(`Attempting to send confirmation email to ${maskEmail(to)}`);
    
    try {
        const info = await otpTransporter.sendMail({
            from: `"LinkUp Contact Form" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Thank You for Contacting Us',
            priority: 'high', // Mark as high priority for faster delivery
            text: `Hello,\n\nThank you for contacting us through our LinkUp form. Your details have been received and saved successfully.\n\nWe will get back to you as soon as possible.\n\nRegards,\nLinkUp Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Thank You for Contacting Us</h2>
                    <p>Hello,</p>
                    <p>Thank you for contacting us through our LinkUp form. Your details have been received and saved successfully.</p>
                    <p>We will get back to you as soon as possible.</p>
                    <p>Regards,<br>LinkUp Team</p>
                </div>
            `
        });
        
        console.log(`Confirmation email sent to ${maskEmail(to)}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
};

// Send Notification Email to Admin
const sendNotificationEmail = async (message) => {
    console.log(`Attempting to send notification email to admin`);
    
    // Try up to 3 times to send the notification
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const info = await notificationTransporter.sendMail({
                from: `"LinkUp Notifications" <${process.env.NOTIFICATION_EMAIL}>`,
                to: process.env.PERSONAL_EMAIL,
                subject: 'New Contact Form Submission',
                priority: 'high', // Mark as high priority for faster delivery
                text: `Hello,\n\nYou have received a new message from your LinkUp contact form:\n\n${message}\n\nRegards,\nLinkUp Notification System`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #333; text-align: center;">New Contact Form Submission</h2>
                        <p>Hello,</p>
                        <p>You have received a new message from your LinkUp contact form:</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                        <p>Regards,<br>LinkUp Notification System</p>
                    </div>
                `
            });
            
            console.log(`Notification email sent to admin`);
            return true;
        } catch (error) {
            console.error(`Error sending notification email (attempt ${attempt}/3):`, error);
            if (attempt === 3) {
                console.error('All notification email attempts failed');
                return false;
            }
            // Wait a short time before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

module.exports = { sendOTPEmail, sendConfirmationEmail, sendNotificationEmail };