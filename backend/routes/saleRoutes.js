const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// GET /sales?filtros...
router.get('/', saleController.getSales);

module.exports = router;
