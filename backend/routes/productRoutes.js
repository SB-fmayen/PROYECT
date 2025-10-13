const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ✅ Cada uno de estos métodos debe existir en el controller
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
