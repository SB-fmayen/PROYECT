const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const prisma = new PrismaClient();

exports.getSalesReportPDF = async (req, res) => {
  try {
    const { desde, hasta, cliente, producto, region } = req.query;

    const sales = await prisma.sale.findMany({
      where: {
        ...(desde && hasta && {
          saleDate: {
            gte: new Date(desde),
            lte: new Date(hasta)
          }
        }),
        ...(cliente && { customerId: cliente }),
        ...(producto && { productId: producto }),
        ...(region && { regionId: region })
      },
      include: {
        product: true,
        customer: true,
        employee: true,
        region: true
      }
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_ventas.pdf"');
    doc.pipe(res);

    doc.fontSize(16).text('Reporte de Ventas (Filtrado)', { align: 'center' });
    doc.moveDown();

    sales.forEach((sale) => {
      doc.fontSize(10).text(`Venta ID: ${sale.id}`);
      doc.text(`Producto: ${sale.product.name}`);
      doc.text(`Cliente: ${sale.customer.name}`);
      doc.text(`Empleado: ${sale.employee.name}`);
      doc.text(`Región: ${sale.region.city}`);
      doc.text(`Total: Q${sale.totalAmount}`);
      doc.text(`Fecha: ${sale.saleDate.toISOString().split('T')[0]}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    res.status(500).json({ error: 'No se pudo generar el PDF' });
  }
};


exports.getSalesReportExcel = async (req, res) => {
  try {
    const { desde, hasta, cliente, producto, region } = req.query;

    const sales = await prisma.sale.findMany({
      where: {
        ...(desde && hasta && {
          saleDate: {
            gte: new Date(desde),
            lte: new Date(hasta)
          }
        }),
        ...(cliente && { customerId: cliente }),
        ...(producto && { productId: producto }),
        ...(region && { regionId: region })
      },
      include: {
        product: true,
        customer: true,
        employee: true,
        region: true
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Producto', key: 'producto', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Empleado', key: 'empleado', width: 20 },
      { header: 'Región', key: 'region', width: 20 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 15 }
    ];

    sales.forEach((sale) => {
      worksheet.addRow({
        id: sale.id,
        producto: sale.product.name,
        cliente: sale.customer.name,
        empleado: sale.employee.name,
        region: sale.region.city,
        total: sale.totalAmount,
        fecha: sale.saleDate.toISOString().split('T')[0]
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_ventas.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ Error al generar Excel:', error);
    res.status(500).json({ error: 'No se pudo generar el Excel' });
  }
};
