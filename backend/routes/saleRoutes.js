const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const path = require('path');

const saleController = require('../controllers/saleController');

router.get('/', saleController.getSales);
router.post('/upload/csv', upload.single('archivo'), saleController.uploadCSV);
router.post('/upload/xlsx', upload.single('archivo'), saleController.uploadXLSX);
router.post('/upload/pdf', upload.single('archivo'), saleController.uploadPDF);


module.exports = router; // ✅ Exportación correcta
