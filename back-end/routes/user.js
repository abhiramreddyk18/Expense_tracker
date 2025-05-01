const express = require('express');

const router = express.Router();
const {loginUser,}=require('../controllers/usercontroller');

router.post('/check_user',loginUser);
router.get('/searchuser',search_user_by_phone);

module.exports = router;