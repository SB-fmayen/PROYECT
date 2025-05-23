// ✅ FRONTEND - sales.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sale.service'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: any[] = [];

  filtro = {
    customerId: '',
    productId: '',
    employeeId: '', // ✅ nuevo campo
    fechaInicio: '',
    fechaFin: '',
    paymentMethod: '',
    regionId: '',
    minTotal: '',
    maxTotal: ''
  };

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this.salesService.getAllSales(this.filtro).subscribe((data: any[]) => {
  this.sales = data;
});

  }

  filtrar(): void {
    this.obtenerVentas();
  }

  limpiarFiltros(): void {
    this.filtro = {
      customerId: '',
      productId: '',
      employeeId: '',
      fechaInicio: '',
      fechaFin: '',
      paymentMethod: '',
      regionId: '',
      minTotal: '',
      maxTotal: ''
    };
    this.obtenerVentas();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const headers = [['ID', 'Fecha', 'Producto', 'Cliente', 'Empleado', 'Cantidad', 'Precio Unitario', 'Total', 'Descuento', 'Método Pago', 'Región']];
    const data = this.sales.map(s => ([
      s.id,
      new Date(s.saleDate).toLocaleDateString(),
      s.productId,
      s.customerId,
      s.employeeId,
      s.quantity,
      s.unitPrice,
      s.totalAmount,
      s.discount,
      s.paymentMethod,
      s.regionId
    ]));

    doc.setFontSize(16);
    doc.text('Listado de Ventas', 40, 40);
    autoTable(doc, {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid'
    });
    doc.save('ventas.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'saleDate', width: 15 },
      { header: 'Producto', key: 'productId', width: 15 },
      { header: 'Cliente', key: 'customerId', width: 15 },
      { header: 'Empleado', key: 'employeeId', width: 15 },
      { header: 'Cantidad', key: 'quantity', width: 10 },
      { header: 'Precio Unitario', key: 'unitPrice', width: 15 },
      { header: 'Total', key: 'totalAmount', width: 15 },
      { header: 'Descuento', key: 'discount', width: 15 },
      { header: 'Método Pago', key: 'paymentMethod', width: 15 },
      { header: 'Región', key: 'regionId', width: 15 }
    ];
    this.sales.forEach(s => worksheet.addRow(s));
    worksheet.getRow(1).font = { bold: true };
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'ventas.xlsx');
    });
  }
}
