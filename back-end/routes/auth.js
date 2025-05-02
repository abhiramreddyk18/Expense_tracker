const express = require('express');
const {  verifyOtp,SendingOtp } = require('../controllers/otpcontroller');
const router = express.Router();

router.post('/verify-otp', verifyOtp);
router.post('/sendotp',SendingOtp)


module.exports = router;
