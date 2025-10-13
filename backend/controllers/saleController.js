// 📁 backend/controllers/saleController.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const { PrismaClient } = require('@prisma/client');
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
    let contador = Date.now();

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        ventas.push({
          id: row.id || `venta_${contador++}`,
          fechaVenta: new Date(row.fechaVenta),
          productoId: row.productoId.toString(),
          clienteId: row.clienteId.toString(),
          empleadoId: row.empleadoId.toString(),
          cantidad: Number(row.cantidad),
          precioUnitario: Number(row.precioUnitario),
          total: Number(row.total),
          descuento: row.descuento ? Number(row.descuento) : 0,
          metodoPago: row.metodoPago || 'EFECTIVO',
          regionId: row.regionId ? row.regionId.toString() : '1',
          actualizadoEn: new Date()
        });
      })
      .on('end', async () => {
        try {
          const cleanData = ventas.map(v =>
            Object.fromEntries(Object.entries(v).filter(([_, val]) => val !== undefined))
          );

          await prisma.venta.createMany({
            data: cleanData,
            skipDuplicates: true
          });

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

exports.uploadXLSX = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    let contador = Date.now();

    const ventas = jsonData.map(row => ({
      id: row.id || `venta_${contador++}`,
      fechaVenta: new Date(row.fechaVenta),
      productoId: row.productoId.toString(),
      clienteId: row.clienteId.toString(),
      empleadoId: row.empleadoId.toString(),
      cantidad: Number(row.cantidad),
      precioUnitario: Number(row.precioUnitario),
      total: Number(row.total),
      descuento: row.descuento ? Number(row.descuento) : 0,
      metodoPago: row.metodoPago || 'EFECTIVO',
      regionId: row.regionId ? row.regionId.toString() : '1',
      actualizadoEn: new Date()
    }));

    const cleanData = ventas.map(v =>
      Object.fromEntries(Object.entries(v).filter(([_, val]) => val !== undefined))
    );

    await prisma.venta.createMany({
      data: cleanData,
      skipDuplicates: true
    });

    res.status(200).json({ message: 'Ventas desde XLSX cargadas exitosamente.' });
  } catch (err) {
    console.error('❌ Error al subir XLSX:', err);
    res.status(500).json({ error: 'Error al procesar archivo XLSX.' });
  }
};
exports.uploadPDF = async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const fs = require('fs');
  const path = require('path');
  const { exec } = require('child_process');

  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Archivo no recibido' });

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const pdfFilename = `venta_${Date.now()}.pdf`;
    const pdfPath = path.join(uploadsDir, pdfFilename);
    const txtPath = pdfPath.replace('.pdf', '.txt');

    fs.writeFileSync(pdfPath, file.buffer);

    // Permitir configurar la ruta al binario de pdftotext mediante una variable
    // de entorno para evitar rutas hardcodeadas que puedan fallar en otros
    // entornos. Si no se especifica, se asume que `pdftotext` está disponible
    // en el PATH del sistema.
    const popplerPath = process.env.PDFTOTEXT_PATH || 'pdftotext';

    exec(`${popplerPath} "${pdfPath}" "${txtPath}"`, async (error) => {
      if (error) {
        console.error('❌ Error ejecutando pdftotext:', error);
        return res.status(500).json({ error: 'Error al convertir PDF a texto' });
      }

      if (!fs.existsSync(txtPath)) {
        return res.status(500).json({ error: 'No se generó el archivo TXT.' });
      }

      const contenido = fs.readFileSync(txtPath, 'utf8');
      console.log('🔍 Contenido TXT:', contenido);

      const lineas = contenido.split('\n').map(l => l.trim()).filter(Boolean);
      const ventas = [];
      let contador = Date.now();

      for (const linea of lineas) {
        try {
          const campos = Object.fromEntries(
            linea.split(',').map(part => {
              const [clave, valor] = part.trim().split(':').map(v => v.trim());
              return [clave, valor];
            })
          );

          const cantidad = parseInt(campos.cantidad || '1');
          const precioUnitario = parseFloat(campos.precioUnitario || '0');
          const total = campos.total?.trim() ? parseFloat(campos.total) : cantidad * precioUnitario;

          ventas.push({
            id: `venta_${contador++}`,
            productoId: String(campos.productoId),
            clienteId: String(campos.clienteId),
            empleadoId: String(campos.empleadoId),
            fechaVenta: new Date(campos.fechaVenta),
            cantidad,
            precioUnitario,
            total,
            descuento: parseInt(campos.descuento || '0'),
            metodoPago: campos.metodoPago || 'EFECTIVO',
            regionId: String(campos.regionId || '1'),
            actualizadoEn: new Date()
          });
        } catch (err) {
          console.warn('❗ Línea inválida omitida:', linea);
        }
      }

      if (ventas.length > 0) {
        await prisma.venta.createMany({
          data: ventas,
          skipDuplicates: true
        });
      }

      fs.unlinkSync(pdfPath);
      fs.unlinkSync(txtPath);

      res.json({ message: `✅ PDF convertido. Ventas insertadas: ${ventas.length}` });
    });
  } catch (err) {
    console.error('❌ Error general en uploadPDF:', err);
    res.status(500).json({ error: 'Error al procesar PDF' });
  }
};
