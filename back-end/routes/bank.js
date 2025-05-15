const express = require('express');
const router = express.Router();
const {check_user,verify_bank_details, getSummaryForLastNDays, getcategorySum}=require("../controllers/bankcontroller")

router.post('/check-user', check_user );

router.post('/verify_bank_details',verify_bank_details ); 
router.get('/summary/:userId', getSummaryForLastNDays);
router.get('/category-summary/:userId',getcategorySum);
module.exports = router;
