const express = require('express');
const router = express.Router();
const { search_user_by_phone, search_user_by_id } = require('../controllers/usercontroller'); // Import your controller function


router.get('/searchuser', search_user_by_phone);
router.get('/:id',search_user_by_id);

module.exports = router;
