const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};
