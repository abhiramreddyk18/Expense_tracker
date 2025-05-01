const express = require('express');
const { createOrder, verifyPayment, recent_payments } = require('../controllers/paymentcontroller');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/recent-payments/:userId',recent_payments);

module.exports = router;
