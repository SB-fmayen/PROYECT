// controllers/employeeController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getEmployees = async (req, res) => {
  try {
    const {
      name = '',
      department = '',
      managerId = '',
      createdFrom = '',
      createdTo = ''
    } = req.query;

    // Armamos filtros usando tus campos en español
    const filters = {
      nombre:     name       ? { contains: name.trim()} : undefined,
      departamento: department ? { equals: department.trim().toUpperCase() }   : undefined,
      jefeId:     managerId  ? String(managerId).trim()                       : undefined,
      creadoEn: (createdFrom && createdTo)
        ? {
            gte: new Date(createdFrom + 'T00:00:00Z'),
            lte: new Date(createdTo   + 'T23:59:59Z')
          }
        : undefined
    };

    // Eliminamos claves undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    console.log('🧪 Filtros empleados:', cleanFilters);

    // Consulta sobre prisma.empleado
    const empleados = await prisma.empleado.findMany({
      where: cleanFilters,
      orderBy: { creadoEn: 'desc' },
      select: {
        id:          true,
        nombre:      true,
        departamento: true,
        jefeId:      true,
        creadoEn:    true,
        actualizadoEn: true
      }
    });

    // Mapeamos al formato que espera el frontend
    const response = empleados.map(e => ({
      id:         e.id,
      name:       e.nombre,
      department: e.departamento,
      managerId:  e.jefeId,
      createdAt:  e.creadoEn,
      updatedAt:  e.actualizadoEn
    }));

    res.json(response);
  } catch (error) {
    console.error('❌ Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error interno al obtener empleados', detail: error.message });
  }
};
 