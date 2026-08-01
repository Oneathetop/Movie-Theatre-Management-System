const express = require('express');
const router = express.Router();
const { getTheaterAnalytics, getRevenueReport } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Dashboard summary can be read by any authenticated staff members
router.get('/dashboard', protect, authorizeRoles('Staff', 'Manager'), getTheaterAnalytics);

// Deep revenue aggregations can ONLY be unlocked by explicit Manager authorization clearances
router.get('/revenue-report', protect, authorizeRoles('Manager'), getRevenueReport);

module.exports = router;
