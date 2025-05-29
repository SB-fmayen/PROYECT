// controllers/categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategories = async (req, res) => {
  try {
    const { name = '', createdFrom = '', createdTo = '' } = req.query;

    // Construimos filtros con los campos en español
    const filters = {
      nombre: name
        ? { contains: name.trim() }
        : undefined,
      creadoEn:
        createdFrom && createdTo
          ? {
              gte: new Date(createdFrom + 'T00:00:00Z'),
              lte: new Date(createdTo   + 'T23:59:59Z'),
            }
          : undefined,
    };

    // Limpiamos undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    console.log('🧪 Filtros categorías:', cleanFilters);

    // Consulta sobre prisma.categoria
    const categorias = await prisma.categoria.findMany({
      where:  cleanFilters,
      orderBy: { creadoEn: 'desc' },
      select: {
        id:            true,
        nombre:        true,
        creadoEn:      true,
        actualizadoEn: true,
      },
    });

    // Mapeamos a lo que espera Angular
    const response = categorias.map(c => ({
      id:         c.id,
      name:       c.nombre,
      createdAt:  c.creadoEn,
      updatedAt:  c.actualizadoEn
    }));

    res.json(response);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno al obtener categorías', detail: error.message });
  }
};
