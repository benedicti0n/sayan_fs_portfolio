const express = require('express');
const { submitForm, verifyAndSave } = require('../controllers/userController');

const router = express.Router();

router.post('/submit', submitForm);
router.post('/verify', verifyAndSave);

module.exports = router;