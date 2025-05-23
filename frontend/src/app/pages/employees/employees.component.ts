import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 🔥 IMPORTANTE
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        // <-- ✅ Agregado aquí
    HttpClientModule
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  filtro = {
    name: '',
    department: '',
    managerId: '',
    createdFrom: '',
    createdTo: ''
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(): void {
    this.filtro.name = this.filtro.name.replace(/\s+/g, ' ').trim();
    this.filtro.department = this.filtro.department.replace(/\s+/g, ' ').trim();
    this.employeeService.getFilteredEmployees(this.filtro).subscribe({
      next: data => this.employees = data,
      error: err => console.error('Error al cargar empleados:', err)
    });
  }

  filtrar(): void {
    this.obtenerEmpleados();
  }

  limpiarFiltros(): void {
    this.filtro = {
      name: '',
      department: '',
      managerId: '',
      createdFrom: '',
      createdTo: ''
    };
    this.filtrar();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const title = 'Listado de Empleados';
const headers = [['ID', 'Nombre', 'Departamento', 'Manager ID', 'Fecha Creación', 'Última Actualización']];

  const data = this.employees.map(e => ([
  e.id,
  e.name,
  e.department,
  e.managerId ?? 'N/A',
  e.createdAt,
  e.updatedAt
]));
    doc.setFontSize(16);
    doc.text(title, 40, 40);

    autoTable(doc, {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 60 },
    });

    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha}`, 40, doc.internal.pageSize.height - 20);

    doc.save('empleados.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Empleados');

 worksheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Nombre', key: 'name', width: 30 },
  { header: 'Departamento', key: 'department', width: 20 },
  { header: 'Manager ID', key: 'managerId', width: 15 },
  { header: 'Fecha Creación', key: 'createdAt', width: 20 },
  { header: 'Última Actualización', key: 'updatedAt', width: 20 },
];


    this.employees.forEach(e => {
      worksheet.addRow(e);
    });

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow(row => {
      row.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'empleados.xlsx');
    });
  }
}
