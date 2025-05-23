const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de registro CORREGIDA
router.post('/register', authController.register); // Asegúrate que authController.register sea una función

// Ruta de login
router.post('/login', authController.login);

module.exports = router;