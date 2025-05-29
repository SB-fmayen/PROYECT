// controllers/productController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  try {
    const {
      name = '',
      categoryId = '',
      minPrice = '',
      maxPrice = '',
      fechaInicio = '',
      fechaFin = ''
    } = req.query;

    const filters = {
      nombre: name
        ? { contains: name.trim()}
        : undefined,
      categoriaId: categoryId
        ? { equals: categoryId.trim() }
        : undefined,
      precioBase:
        minPrice && maxPrice
          ? { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) }
          : undefined,
      creadoEn:
        fechaInicio && fechaFin
          ? {
              gte: new Date(fechaInicio + 'T00:00:00Z'),
              lte: new Date(fechaFin    + 'T23:59:59Z')
            }
          : undefined
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );
    console.log('🧪 Filtros productos:', cleanFilters);

    const productos = await prisma.producto.findMany({
      where: cleanFilters,
      orderBy: { nombre: 'asc' },
      select: {
        id:          true,
        nombre:      true,
        categoriaId: true,
        precioBase:  true,
        precioVenta: true,
        creadoEn:    true
      }
    });

    const response = productos.map(p => ({
      id:         p.id,
      name:       p.nombre,
      categoryId: p.categoriaId,
      basePrice:  p.precioBase,
      cost:       p.precioVenta,
      margin:     p.precioVenta - p.precioBase,
      createdAt:  p.creadoEn
    }));

    res.json(response);
  } catch (error) {
    console.error('❌ Error al filtrar productos:', error);
    res.status(500).json({
      error:  'Error interno al filtrar productos',
      detail: error.message
    });
  }
};
