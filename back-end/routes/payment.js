const express = require('express');
const {recent_payments, send_money } = require('../controllers/paymentcontroller');

const router = express.Router();

router.get('/recent-payments/:userId',recent_payments);
router.post('/send_money',send_money)
module.exports = router;
