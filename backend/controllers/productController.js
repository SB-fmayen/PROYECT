// ✅ BACKEND: controllers/productController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  const {
    name = '',
    categoryId = '',
    minPrice = '',
    maxPrice = '',
    fechaInicio = '',
    fechaFin = ''
  } = req.query;

  try {
    const filters = {
      name: name ? { contains: String(name).trim() } : undefined,
      categoryId: categoryId ? { equals: String(categoryId).trim() } : undefined,
      basePrice: minPrice && maxPrice ? {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice)
      } : undefined,
      createdAt: fechaInicio && fechaFin ? {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin)
      } : undefined
    };

    const productos = await prisma.product.findMany({
      where: filters,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        categoryId: true,
        basePrice: true,
        cost: true,
        margin: true,
        createdAt: true
      }
    });

    res.json(productos);
  } catch (error) {
    console.error('❌ Error al filtrar productos:', error.message);
    res.status(500).json({ error: 'Error interno al filtrar productos' });
  }
};
