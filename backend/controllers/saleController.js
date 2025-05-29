// ✅ saleController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSales = async (req, res) => {
  try {
    const {
      clienteId,
      productoId,
      empleadoId,
      fechaInicio,
      fechaFin,
      metodoPago,
      regionId,
      minTotal,
      maxTotal,
    } = req.query;

    const filters = {
      clienteId: clienteId || undefined,
      productoId: productoId || undefined,
      empleadoId: empleadoId || undefined,
      metodoPago: metodoPago || undefined,
      regionId: regionId || undefined,
      fechaVenta:
        fechaInicio && fechaFin
          ? {
              gte: new Date(fechaInicio + 'T00:00:00Z'),
              lte: new Date(fechaFin + 'T23:59:59Z'),
            }
          : undefined,
      total:
        minTotal && maxTotal
          ? {
              gte: parseFloat(minTotal),
              lte: parseFloat(maxTotal),
            }
          : undefined,
    };

    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined));

    const sales = await prisma.venta.findMany({
      where: cleanFilters,
      orderBy: { fechaVenta: 'desc' },
      select: {
        id: true,
        fechaVenta: true,
        productoId: true,
        clienteId: true,
        empleadoId: true,
        cantidad: true,
        precioUnitario: true,
        total: true,
        descuento: true,
        metodoPago: true,
        regionId: true,
      },
    });

    res.json(sales);
  } catch (error) {
    console.error('❌ Error en getSales:', error);
    res.status(500).json({ error: 'Error al obtener las ventas.' });
  }
};