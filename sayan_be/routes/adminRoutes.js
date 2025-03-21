const express = require('express');
const { getAllUsers, deleteUser, testEndpoint } = require('../controllers/adminController');

const router = express.Router();

// Test endpoint
router.get('/test', testEndpoint);

// Get all users
router.get('/users', getAllUsers);

// Delete a user
router.delete('/users/:userId', deleteUser);

module.exports = router; 