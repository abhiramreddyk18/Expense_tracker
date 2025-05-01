const express = require('express');
const {  verifyOtp,sendingotp } = require('../controllers/otpcontroller');
const router = express.Router();

router.post('/verify-otp', verifyOtp);
router.post('/sendopt',SendingOtp)


module.exports = router;
