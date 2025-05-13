const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany();
    res.json(regions);
  } catch (error) {
    console.error("❌ Error al obtener regiones:", error);
    res.status(500).json({ error: 'Error al obtener regiones' });
  }
};
