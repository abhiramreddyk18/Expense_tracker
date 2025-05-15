const express = require('express');
const {recent_payments, sending_money, searchTransactions, setPin, verify_pin } = require('../controllers/paymentcontroller');

const router = express.Router();

// router.get('/recent-payments/:userId',recent_payments);
router.get('/user-payments/:userId',recent_payments);
router.post('/send_money',sending_money)
router.get('/searchtransactions',searchTransactions);
router.post('/user/set-pin',setPin);
router.get('verify_pin',verify_pin);

module.exports = router;
