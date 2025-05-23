const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers); // ✅ Ruta única
module.exports = router;

