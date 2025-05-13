const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSales = async (req, res) => {
  try {
    console.log("🔍 Entró a /sales");
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        product: true,
        employee: true,
        region: true
      }
    });
    console.log("📦 Ventas encontradas:", sales);
    res.json(sales);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};
