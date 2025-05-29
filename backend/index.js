// index.js (BACKEND)
require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importa tus enrutadores
const userRoutes     = require('./routes/userRoutes');
const saleRoutes     = require('./routes/saleRoutes');
const productRoutes  = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const regionRoutes   = require('./routes/regionRoutes');
const authRoutes     = require('./routes/authRoutes');
const reportRoutes   = require('./routes/reportRoutes');
const rolesRoutes    = require('./routes/roles');    // ↔ ‘roles.js’ en /routes

const app    = express();
const prisma = new PrismaClient();
const PORT   = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Para parsear JSON
app.use(express.json());

// Ruta raíz de sanity check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando 🚀',
    timestamp: new Date().toISOString()
  });
});

// Monta todas tus rutas bajo /api/v1
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/sales',     saleRoutes);
app.use('/api/v1/products',  productRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/regions',   regionRoutes);
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/reports',   reportRoutes);
app.use('/api/v1/roles',     rolesRoutes);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Arranca el servidor y conecta Prisma
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error conectando Prisma:', error);
  }
});

// Desconecta Prisma al terminar
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
