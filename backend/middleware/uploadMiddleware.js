// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Guardamos el archivo en memoria para procesarlo desde buffer
const storage = multer.memoryStorage();

// Aceptar solo CSV
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.csv') cb(null, true);
  else cb(new Error('Solo se permiten archivos .csv'), false);
};

module.exports = multer({ storage, fileFilter });
