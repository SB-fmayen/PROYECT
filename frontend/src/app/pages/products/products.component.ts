import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/product.service'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  filtro = {
    name: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productService.getAllProducts(this.filtro).subscribe((data: any[]) => {
      this.products = data;
    });
  }

  filtrar(): void {
    this.obtenerProductos();
  }

  limpiarFiltros(): void {
    this.filtro = {
      name: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.obtenerProductos();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const title = 'Listado de Productos';
    const headers = [['ID', 'Nombre', 'Categoría', 'Precio Base', 'Costo', 'Margen', 'Fecha de Creación']];
    const data = this.products.map(p => ([
      p.id,
      p.name,
      p.categoryId,
      p.basePrice,
      p.cost,
      p.margin,
      new Date(p.createdAt).toLocaleDateString()
    ]));

    doc.setFontSize(16);
    doc.text(title, 40, 40);
    autoTable(doc, {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid'
    });
    doc.save('productos.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Categoría', key: 'categoryId', width: 20 },
      { header: 'Precio Base', key: 'basePrice', width: 15 },
      { header: 'Costo', key: 'cost', width: 15 },
      { header: 'Margen', key: 'margin', width: 15 },
      { header: 'Fecha de Creación', key: 'createdAt', width: 20 }
    ];
    this.products.forEach(p => worksheet.addRow(p));
    worksheet.getRow(1).font = { bold: true };
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'productos.xlsx');
    });
  }
}
