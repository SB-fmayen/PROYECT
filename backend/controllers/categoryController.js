const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategories = async (req, res) => {
  try {
    const { name, createdFrom, createdTo } = req.query;

    const filters = {
      name: name ? { contains: name.trim().toLowerCase() } : undefined,
      createdAt: createdFrom && createdTo ? {
        gte: new Date(createdFrom + 'T00:00:00Z'),
        lte: new Date(createdTo + 'T23:59:59Z')
      } : undefined,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const categories = await prisma.category.findMany({
      where: cleanFilters,
      orderBy: { createdAt: 'desc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
