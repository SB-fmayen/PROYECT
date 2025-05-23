const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getEmployees); // ✅ permite traer todos o filtrados

module.exports = router;
