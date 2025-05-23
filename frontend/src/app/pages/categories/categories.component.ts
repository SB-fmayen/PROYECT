import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategoriesService } from '../../services/category.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  filtro = {
    name: '',
    createdFrom: '',
    createdTo: ''
  };

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.filtro.name = this.filtro.name.replace(/\s+/g, ' ').trim();
    this.categoryService.getFilteredCategories(this.filtro).subscribe({
      next: data => this.categories = data,
      error: err => console.error('Error al cargar categorías:', err)
    });
  }

  filtrar(): void {
    this.obtenerCategorias();
  }

  limpiarFiltros(): void {
    this.filtro = {
      name: '',
      createdFrom: '',
      createdTo: ''
    };
    this.filtrar();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const title = 'Listado de Categorías';
    const headers = [['ID', 'Nombre', 'Fecha de creación', 'Última actualización']];
    const data = this.categories.map(c => [
      c.id,
      c.name,
      c.createdAt,
      c.updatedAt
    ]);

    doc.setFontSize(16);
    doc.text(title, 40, 40);
    autoTable(doc, {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid'
    });

    doc.save('categorias.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categorías');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Fecha de creación', key: 'createdAt', width: 25 },
      { header: 'Última actualización', key: 'updatedAt', width: 25 },
    ];
    this.categories.forEach(c => worksheet.addRow(c));
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'categorias.xlsx');
    });
  }
}
