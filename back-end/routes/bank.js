const express = require('express');
const router = express.Router();

const {
  check_user,
  verify_bank_details,
  getSummaryForLastNDays,
  getcategorySum,
  getCategoryLimits,     
  saveOrUpdateCategoryLimit,
   deleteCategoryLimit 
} = require("../controllers/bankcontroller");


router.post('/check-user', check_user);
router.post('/verify_bank_details', verify_bank_details);
router.get('/summary/:userId', getSummaryForLastNDays);
router.get('/category-summary/:userId', getcategorySum);

router.get('/category-limits/:userId', getCategoryLimits);
router.post('/category-limits/:userId', saveOrUpdateCategoryLimit);
router.delete('/category-limits/:userId/:category', deleteCategoryLimit);


module.exports = router;
