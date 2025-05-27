const express = require('express');
const router = express.Router();

const {
  check_user,
  verify_bank_details,
  getSummaryForLastNDays,
  getcategorySum,
  getCategoryLimits,      // new controller to get limits
  saveOrUpdateCategoryLimit // new controller to save/update limit
} = require("../controllers/bankcontroller");

// Existing routes
router.post('/check-user', check_user);
router.post('/verify_bank_details', verify_bank_details);
router.get('/summary/:userId', getSummaryForLastNDays);
router.get('/category-summary/:userId', getcategorySum);

// New routes for category limits
router.get('/category-limits/:userId', getCategoryLimits);
router.post('/category-limits/:userId', saveOrUpdateCategoryLimit);

module.exports = router;
