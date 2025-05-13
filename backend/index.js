require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const userRoutes = require('./routes/userRoutes');
const saleRoutes = require('./routes/saleRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const regionRoutes = require('./routes/regionRoutes');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/verifyToken');
const checkRole = require('./middleware/checkRole');
const reportRoutes = require('./routes/reportRoutes');





const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// RUTA REGISTRADA CORRECTAMENTE
// RUTAS
app.use('/users', userRoutes); // sin autenticación
app.use('/sales', saleRoutes); // ✔ sin verifyToken
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/employees', employeeRoutes);
app.use('/categories', categoryRoutes);
app.use('/regions', regionRoutes);
app.use('/', authRoutes);
app.use('/api/reports', reportRoutes);



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
