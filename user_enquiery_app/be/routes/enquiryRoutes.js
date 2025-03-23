const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');

// Route for creating a new enquiry (public) and getting all enquiries (private)
router.route('/')
  .post(createEnquiry)
  .get(getEnquiries);

// Routes for getting, updating, and deleting a specific enquiry by ID (all private)
router.route('/:id')
  .get(getEnquiry)
  .put(updateEnquiry)
  .delete(deleteEnquiry);

module.exports = router; 