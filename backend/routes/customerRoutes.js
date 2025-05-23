const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Ruta GET /customers
router.get('/', customerController.getCustomers);

module.exports = router;
