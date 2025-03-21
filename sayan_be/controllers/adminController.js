const User = require('../models/User');

/**
 * Simple test endpoint to verify admin routes are working
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const testEndpoint = async (req, res) => {
    console.log('Admin test endpoint called');
    res.status(200).json({ message: 'Admin routes are working correctly', timestamp: new Date().toISOString() });
};

/**
 * Get all users from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    console.log('Admin getAllUsers endpoint called');
    try {
        // Fetch all users, sorted by creation date (newest first)
        console.log('Attempting to fetch users from database');
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .select('-__v'); // Exclude version field
        
        console.log(`Retrieved ${users.length} users`);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

/**
 * Delete a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
    console.log('Admin deleteUser endpoint called with userId:', req.params.userId);
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    
    try {
        console.log(`Attempting to delete user with ID: ${userId}`);
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            console.log(`User with ID ${userId} not found`);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log(`Deleted user: ${deletedUser.email}`);
        res.status(200).json({ message: 'User deleted successfully', userId });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

module.exports = { getAllUsers, deleteUser, testEndpoint }; 