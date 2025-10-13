 // 📁 backend/middleware/uploadMiddleware.js
const multer = require('multer');

const storage = multer.memoryStorage(); // usamos buffer en memoria

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase();
  if (ext.endsWith('.csv') || ext.endsWith('.xlsx') || ext.endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos CSV, XLSX o PDF'), false);
  }
};

module.exports = multer({ storage, fileFilter });
