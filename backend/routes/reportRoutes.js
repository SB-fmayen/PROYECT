const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Rutas públicas sin token
router.get('/pdf', reportController.getSalesReportPDF);
router.get('/excel', reportController.getSalesReportExcel);

module.exports = router;
