// 📁 backend/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const saleController = require('../controllers/saleController');

router.get('/', saleController.getSales);
router.post('/upload', upload.single('file'), saleController.uploadCSV);

module.exports = router;
