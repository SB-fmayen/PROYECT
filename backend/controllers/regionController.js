// controllers/regionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRegions = async (req, res) => {
  try {
    const { city = '', country = '', createdFrom = '', createdTo = '' } = req.query;

    // Construimos filtros con los nombres reales del modelo:
    const filters = {
      ciudad: city
        ? { contains: city.trim() }
        : undefined,
      pais: country
        ? { contains: country.trim() }
        : undefined,
      creadoEn:
        createdFrom && createdTo
          ? {
              gte: new Date(createdFrom + 'T00:00:00Z'),
              lte: new Date(createdTo   + 'T23:59:59Z'),
            }
          : undefined,
    };

    // Eliminamos los undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );
    console.log('🧪 Filtros regiones:', cleanFilters);

    // Consulta usando prisma.region
    const regiones = await prisma.region.findMany({
      where:  cleanFilters,
      orderBy: { creadoEn: 'desc' },
      select: {
        id:            true,
        ciudad:        true,
        coordenadas:   true,
        pais:          true,
        creadoEn:      true,
        actualizadoEn: true,
      },
    });

    // Mapeamos al formato que espera Angular
    const response = regiones.map(r => ({
      id:          r.id,
      city:        r.ciudad,
      coordinates: r.coordenadas,
      country:     r.pais,
      createdAt:   r.creadoEn,
      updatedAt:   r.actualizadoEn,
    }));

    res.json(response);
  } catch (error) {
    console.error('❌ Error al obtener regiones:', error);
    res.status(500).json({ error: 'Error interno al obtener regiones', detail: error.message });
  }
};
