const express = require('express');
const router = express.Router();
const { search_user_by_phone } = require('../controllers/usercontroller'); // Import your controller function

// Define the route for searching user by phone
router.get('/searchuser', search_user_by_phone);

module.exports = router;
