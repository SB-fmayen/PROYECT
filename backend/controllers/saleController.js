// 📁 backend/controllers/saleController.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const prisma = new PrismaClient();

exports.getSales = async (req, res) => {
  try {
    const {
      search, id, clienteId, productoId, empleadoId,
      fromDate, metodoPago, regionId, minTotal, maxTotal,
    } = req.query;

    let fechaVenta = undefined;
    if (fromDate) {
      const [y, m, d] = fromDate.split('-').map(Number);
      fechaVenta = {
        gte: new Date(y, m - 1, d, 0, 0, 0),
        lte: new Date(y, m - 1, d, 23, 59, 59, 999),
      };
    }

    const filters = {
      id: id || undefined,
      clienteId: clienteId || undefined,
      productoId: productoId || undefined,
      empleadoId: empleadoId || undefined,
      metodoPago: metodoPago || undefined,
      regionId: regionId || undefined,
      total: minTotal && maxTotal
        ? {
            gte: parseFloat(minTotal),
            lte: parseFloat(maxTotal),
          }
        : undefined,
    };

    const whereClause = {
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
      ...(fechaVenta ? { fechaVenta } : {})
    };

    const searchFilter = search
      ? {
          OR: [
            { id: { contains: search } },
            { clienteId: { contains: search } },
            { productoId: { contains: search } },
            { empleadoId: { contains: search } },
          ],
        }
      : {};

    const sales = await prisma.venta.findMany({
      where: {
        ...whereClause,
        ...searchFilter,
      },
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

exports.uploadCSV = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../', req.file.path);
    const ventas = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        ventas.push({
          id: row.id,
          fechaVenta: new Date(row.fechaVenta),
          productoId: row.productoId,
          clienteId: row.clienteId,
          empleadoId: row.empleadoId,
          cantidad: Number(row.cantidad),
          precioUnitario: Number(row.precioUnitario),
          total: Number(row.total),
          descuento: row.descuento ? Number(row.descuento) : 0,
          metodoPago: row.metodoPago,
          regionId: row.regionId,
        });
      })
      .on('end', async () => {
        try {
          await prisma.venta.createMany({ data: ventas, skipDuplicates: true });
          fs.unlinkSync(filePath);
          res.status(200).json({ message: 'Ventas cargadas exitosamente' });
        } catch (err) {
          console.error('❌ Error al insertar CSV:', err);
          res.status(500).json({ error: 'Error al insertar ventas desde CSV.' });
        }
      });
  } catch (err) {
    console.error('❌ Error en uploadCSV:', err);
    res.status(500).json({ error: 'Error al procesar el archivo.' });
  }
};
