const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCustomers = async (req, res) => {
  try {
    const {
      nombre = '',
      email = '',
      phone = '',
      segment = '',
      regionId = '',
      fechaInicio = '',
      fechaFin = ''
    } = req.query;

    // ✅ Este es el bloque filters
    const filters = {
      name: nombre ? { contains: String(nombre).trim() } : undefined,
      email: email ? { contains: String(email).trim() } : undefined,
      phone: phone ? { contains: String(phone).trim() } : undefined,
      segment: segment ? { equals: String(segment).trim() } : undefined,
      regionId: regionId ? { equals: String(regionId).trim() } : undefined,
      joinDate:
        fechaInicio && fechaFin
          ? {
              gte: new Date(fechaInicio),
              lte: new Date(fechaFin),
            }
          : undefined,
    };

    // 🔎 Consulta con filtros aplicados
    const customers = await prisma.customer.findMany({
      where: filters,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        segment: true,
        regionId: true,
        joinDate: true,
        phone: true,
        email: true,
      },
    });

    res.json(customers);
  } catch (error) {
    console.error('❌ Error en getCustomers:', error.message);
    res.status(500).json({
      error: 'Error interno al filtrar clientes',
      detalle: error.message,
    });
  }
};
