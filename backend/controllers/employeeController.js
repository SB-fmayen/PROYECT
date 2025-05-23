const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getEmployees = async (req, res) => {
  try {
    const {
      name,
      department,
      managerId,
      createdFrom,
      createdTo,
    } = req.query;

    const filters = {
name: name ? { contains: name.trim().toLowerCase() } : undefined,
      department: department ? { equals: department.trim().toUpperCase() } : undefined,
      managerId: managerId ? String(managerId).trim() : undefined,
      createdAt: createdFrom && createdTo ? {
        gte: new Date(createdFrom + 'T00:00:00Z'),
        lte: new Date(createdTo + 'T23:59:59Z')
      } : undefined,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    console.log("🧪 Filtros aplicados:", cleanFilters); // 👈 Verifica esto en consola

    const employees = await prisma.employee.findMany({
      where: cleanFilters,
      orderBy: { createdAt: 'desc' },
    });

    res.json(employees);
  } catch (error) {
    console.error('❌ Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};
