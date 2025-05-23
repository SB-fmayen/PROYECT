import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../services/customer.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  mostrarTabla = true;

  filtro = {
    nombre: '',
    email: '',
    phone: '',
    segment: '',
    regionId: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {
    this.obtenerCustomers();
    window.addEventListener('toggleCustomersTable', () => {
      this.mostrarTabla = !this.mostrarTabla;
    });
  }

  obtenerCustomers(): void {
    this.customerService.getAllCustomers(this.filtro).subscribe((data: any[]) => {
      console.log('🔍 Clientes recibidos:', data);
      this.customers = data;
    });
  }

  filtrar(): void {
    this.obtenerCustomers();
  }

  limpiarFiltros(): void {
    this.filtro = {
      nombre: '',
      email: '',
      phone: '',
      segment: '',
      regionId: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.obtenerCustomers();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const headers = [['ID', 'Nombre', 'Segmento', 'Región', 'Fecha de Ingreso', 'Teléfono', 'Email']];
    const data = this.customers.map(c => [
      c.id, c.name, c.segment, c.regionId, c.joinDate, c.phone, c.email
    ]);

    doc.setFontSize(16);
    doc.text('Listado de Clientes', 40, 40);
    autoTable(doc, {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 60 },
    });

    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha}`, 40, doc.internal.pageSize.height - 20);
    doc.save('clientes.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clientes');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Segmento', key: 'segment', width: 15 },
      { header: 'Región', key: 'regionId', width: 12 },
      { header: 'Fecha de Ingreso', key: 'joinDate', width: 20 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 30 }
    ];

    this.customers.forEach(c => worksheet.addRow(c));

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'clientes.xlsx');
    });
  }
}
