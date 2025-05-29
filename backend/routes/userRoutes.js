// backend/routes/userRoutes.js
const { Router } = require('express');
const {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} = require('../controllers/userController');

const router = Router();

router.get   ('/',     getUsuarios);
router.post  ('/',     createUsuario);
router.put   ('/:id',  updateUsuario);
router.delete('/:id',  deleteUsuario);

module.exports = router;
