const fs = require('fs');
const path = require('path');

// File path for OTP storage
const OTP_STORE_PATH = path.join(__dirname, '../data/otpStore.json');

// OTP expiration time in milliseconds (15 minutes instead of 5)
const OTP_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

// Ensure the data directory exists
const ensureDataDir = () => {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

// Initialize OTP store from file or create new one
const initOtpStore = () => {
    ensureDataDir();
    try {
        if (fs.existsSync(OTP_STORE_PATH)) {
            const data = fs.readFileSync(OTP_STORE_PATH, 'utf8');
            const storedData = JSON.parse(data);
            
            // Filter out expired OTPs
            const now = Date.now();
            const validOtps = {};
            
            Object.keys(storedData).forEach(email => {
                if (storedData[email].expiresAt > now) {
                    validOtps[email] = storedData[email];
                }
            });
            
            return validOtps;
        }
    } catch (error) {
        console.error('Error reading OTP store file:', error);
    }
    
    // Return empty object if file doesn't exist or has errors
    return {};
};

// In-memory store for OTPs with file backup
let otpStore = initOtpStore();

// Save OTP store to file
const saveOtpStore = () => {
    ensureDataDir();
    try {
        fs.writeFileSync(OTP_STORE_PATH, JSON.stringify(otpStore), 'utf8');
    } catch (error) {
        console.error('Error saving OTP store to file:', error);
    }
};

// Generate OTP - more secure 6-digit code
const generateOTP = () => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated new OTP: ${otp}`);
    return otp;
};

// Store OTP with expiration time
const storeOTP = async (email, otp) => {
    console.log(`Storing OTP ${otp} for email ${email}`);
    
    // Store OTP with expiration time (15 minutes from now)
    const expiresAt = Date.now() + OTP_EXPIRATION_TIME;
    otpStore[email] = {
        otp,
        expiresAt
    };
    
    // Save to file for persistence
    saveOtpStore();
    
    // Automatically delete OTP after expiration
    setTimeout(() => {
        console.log(`OTP for ${email} expired and removed from store`);
        delete otpStore[email];
        saveOtpStore();
    }, OTP_EXPIRATION_TIME);
};

// Verify OTP with expiration check
const verifyOTP = async (email, otp) => {
    console.log(`Verifying OTP ${otp} for email ${email}`);
    
    const storedData = otpStore[email];
    
    // Check if OTP exists and is not expired
    if (storedData && storedData.otp === otp && storedData.expiresAt > Date.now()) {
        console.log(`OTP verification successful for ${email}`);
        delete otpStore[email]; // Delete OTP after verification
        saveOtpStore(); // Update the file
        return true;
    }
    
    console.log(`OTP verification failed for ${email}`);
    return false;
};

module.exports = { generateOTP, storeOTP, verifyOTP };