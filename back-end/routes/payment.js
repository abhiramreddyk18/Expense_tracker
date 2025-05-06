const express = require('express');
const {recent_payments, send_money, searchTransactions } = require('../controllers/paymentcontroller');

const router = express.Router();

router.get('/recent-payments/:userId',recent_payments);
router.post('/send_money',send_money)
router.get('/searchtransactions',searchTransactions);
module.exports = router;
