const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRegions = async (req, res) => {
  try {
    const { city, country, createdFrom, createdTo } = req.query;

    const filters = {
      city: city ? { contains: city.trim().toLowerCase() } : undefined,
      country: country ? { contains: country.trim().toLowerCase() } : undefined,
      createdAt: createdFrom && createdTo ? {
        gte: new Date(createdFrom + 'T00:00:00Z'),
        lte: new Date(createdTo + 'T23:59:59Z')
      } : undefined
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const regions = await prisma.region.findMany({
      where: cleanFilters,
      orderBy: { createdAt: 'desc' }
    });

    res.json(regions);
  } catch (error) {
    console.error('❌ Error al obtener regiones:', error);
    res.status(500).json({ error: 'Error al obtener regiones' });
  }
};
