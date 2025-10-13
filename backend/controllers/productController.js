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
      nombre: name ? { contains: name.trim() } : undefined,
      categoriaId: categoryId ? { equals: categoryId.trim() } : undefined,
      precioBase:
        minPrice && maxPrice
          ? { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) }
          : undefined,
      creadoEn:
        fechaInicio && fechaFin
          ? {
              gte: new Date(fechaInicio + 'T00:00:00Z'),
              lte: new Date(fechaFin + 'T23:59:59Z')
            }
          : undefined
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

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


exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      id: producto.id,
      name: producto.nombre,
      categoryId: producto.categoriaId,
      basePrice: producto.precioBase,
      cost: producto.precioVenta,
      margin: producto.precioVenta - producto.precioBase,
      createdAt: producto.creadoEn,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', detail: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, categoryId, basePrice, cost } = req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre: name,
        categoriaId: categoryId,
        precioBase: parseFloat(basePrice),
        precioVenta: parseFloat(cost),
      },
    });

    res.status(201).json({ message: 'Producto creado', id: producto.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', detail: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, categoryId, basePrice, cost } = req.body;

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        nombre: name,
        categoriaId: categoryId,
        precioBase: parseFloat(basePrice),
        precioVenta: parseFloat(cost),
      },
    });

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', detail: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.producto.delete({ where: { id } });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', detail: error.message });
  }
};
