const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSales = async (req, res) => {
  try {
    const {
      customerId,
      productId,
      employeeId,
      fechaInicio,
      fechaFin,
      paymentMethod,
      regionId,
      minTotal,
      maxTotal,
    } = req.query;

    const filters = {
      customerId: customerId ? String(customerId).trim() : undefined,
      productId: productId ? String(productId).trim() : undefined,
      employeeId: employeeId ? String(employeeId).trim() : undefined, // ✅ nuevo filtro
      paymentMethod: paymentMethod ? String(paymentMethod).trim() : undefined,
      regionId: regionId ? String(regionId).trim() : undefined,
      saleDate:
        fechaInicio && fechaFin
          ? {
              gte: new Date(fechaInicio),
              lte: new Date(fechaFin),
            }
          : undefined,
      totalAmount:
        minTotal && maxTotal
          ? {
              gte: parseFloat(minTotal),
              lte: parseFloat(maxTotal),
            }
          : undefined,
    };

    const sales = await prisma.sale.findMany({
      where: filters,
      orderBy: {
        saleDate: 'desc',
      },
      select: {
        id: true,
        saleDate: true,
        productId: true,
        customerId: true,
        employeeId: true,
        quantity: true,
        unitPrice: true,
        totalAmount: true,
        discount: true,
        paymentMethod: true,
        regionId: true,
      },
    });

    res.json(sales);
  } catch (error) {
    console.error('❌ Error en getSales:', error);
    res.status(500).json({ error: 'Error al obtener las ventas.' });
  }
};
