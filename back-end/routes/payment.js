const express = require('express');
const {recent_payments, sending_money, searchTransactions, setPin} = require('../controllers/paymentcontroller');

const router = express.Router();

// router.get('/recent-payments/:userId',recent_payments);
router.get('/user-payments/:userId',recent_payments);
router.post('/send_money',sending_money)
router.get('/searchtransactions',searchTransactions);
router.post('/user/set-pin',setPin);


module.exports = router;
