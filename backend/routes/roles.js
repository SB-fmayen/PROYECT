// backend/routes/roles.js
const express = require('express');
const { getAllRoles } = require('../controllers/rolesController');
const router = express.Router();

// Cuando alguien haga GET /api/v1/roles → invocamos getAllRoles
router.get('/', getAllRoles);

module.exports = router;
