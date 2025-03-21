const mongoose = require('mongoose');

// Drop any existing indexes when the model is compiled
mongoose.set('autoIndex', false);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure no unique index on email
userSchema.index({ email: 1 }, { unique: false });

module.exports = mongoose.model('User', userSchema);