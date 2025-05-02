const express = require('express');

const router = express.Router();
const {loginUser,search_user_by_phone}=require('../controllers/usercontroller');


router.get('/searchuser',search_user_by_phone);

module.exports = router;