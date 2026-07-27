const express = require('express');
const router = express.Router();
const { getTheaterAnalytics } = require('../controllers/analyticsController');

router.get('/dashboard', getTheaterAnalytics);
router.get('/revenue-report', require('../controllers/analyticsController').getRevenueReport);

module.exports = router;
