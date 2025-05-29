// controllers/customerController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCustomers = async (req, res) => {
  try {
    // extraemos los params
    const {
      nombre = '',
      correo = '',
      telefono = '',
      regionId = '',
      fechaInicio = '',
      fechaFin = ''
    } = req.query;

    // armamos filtros con los campos reales
    const filters = {
      nombre: nombre ? { contains: nombre.trim() } : undefined,
      correo: correo ? { contains: correo.trim() } : undefined,
      telefono: telefono ? { contains: telefono.trim() } : undefined,
      regionId: regionId ? { equals: regionId.trim() } : undefined,
      creadoEn: (fechaInicio && fechaFin)
        ? {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        }
        : undefined,
    };

    // consulta sobre prisma.cliente
    const clientes = await prisma.cliente.findMany({
      where: filters,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        correo: true,
        telefono: true,
        regionId: true,
        creadoEn: true
      }
    });

    // mapeamos al formato que espera Angular
    const response = clientes.map(c => ({
      id: c.id,
      name: c.nombre,
      email: c.correo,
      phone: c.telefono,
      regionId: c.regionId,
      joinDate: c.creadoEn
    }));

    res.json(response);
  } catch (error) {
    console.error('❌ Error en getCustomers:', error);
    res.status(500).json({
      error: 'Error interno al filtrar clientes',
      detalle: error.message
    });
  }
};
