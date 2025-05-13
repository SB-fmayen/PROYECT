const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { region: true }
    });
    res.json(customers);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};
