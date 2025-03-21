// In-memory store for OTPs
const otpStore = {};

// Store OTP in memory
const storeOTP = async (email, otp) => {
    otpStore[email] = otp;
    // Automatically delete OTP after 5 minutes
    setTimeout(() => delete otpStore[email], 5 * 60 * 1000); // 5 minutes
};

// Verify OTP
const verifyOTP = async (email, otp) => {
    const storedOTP = otpStore[email];
    if (storedOTP === otp) {
        delete otpStore[email]; // Delete OTP after verification
        return true;
    }
    return false;
};

module.exports = { storeOTP, verifyOTP };