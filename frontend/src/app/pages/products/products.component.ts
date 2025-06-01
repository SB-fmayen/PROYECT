import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService, Product } from '../../services/product.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filtro = {
    name: '', categoryId: '', minPrice: '', maxPrice: '', fechaInicio: '', fechaFin: ''
  };

  showFilter = false;
  selectedProduct: Product | null = null;
  newProduct: Product = { id: '', name: '', categoryId: '', basePrice: 0, cost: 0, margin: 0, createdAt: '' };

  @ViewChild('addModal') addModal: any;
  @ViewChild('editModal') editModal: any;
  @ViewChild('deleteModal') deleteModal: any;

  constructor(private modalService: NgbModal, private productService: ProductsService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  toggleFilters(): void {
    this.showFilter = !this.showFilter;
  }

  obtenerProductos(): void {
    this.productService.getAllProducts(this.filtro).subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  filtrar(): void {
    this.obtenerProductos();
  }

  limpiarFiltros(): void {
    this.filtro = { name: '', categoryId: '', minPrice: '', maxPrice: '', fechaInicio: '', fechaFin: '' };
    this.obtenerProductos();
  }

  abrirAddModal(): void {
    this.newProduct = { id: '', name: '', categoryId: '', basePrice: 0, cost: 0, margin: 0, createdAt: '' };
    this.modalService.open(this.addModal);
  }

  abrirEditModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.modalService.open(this.editModal);
  }

  abrirDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.modalService.open(this.deleteModal);
  }

  cerrarModal(): void {
    this.modalService.dismissAll();
  }

  guardarProducto(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.cerrarModal();
      this.obtenerProductos();
    });
  }

  guardarEdicion(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(() => {
        this.cerrarModal();
        this.obtenerProductos();
      });
    }
  }

  confirmarBorrado(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe(() => {
        this.cerrarModal();
        this.obtenerProductos();
      });
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const headers = [['ID', 'Nombre', 'Categoría', 'Precio Base', 'Costo', 'Margen', 'Fecha']];
    const data = this.products.map(p => [
      p.id, p.name, p.categoryId, p.basePrice, p.cost, p.margin, new Date(p.createdAt).toLocaleDateString()
    ]);
    doc.setFontSize(14);
    doc.text('Listado de Productos', 40, 40);
    autoTable(doc, { startY: 60, head: headers, body: data });
    doc.save('productos.pdf');
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Categoría', key: 'categoryId', width: 20 },
      { header: 'Precio Base', key: 'basePrice', width: 15 },
      { header: 'Costo', key: 'cost', width: 15 },
      { header: 'Margen', key: 'margin', width: 15 },
      { header: 'Fecha', key: 'createdAt', width: 20 }
    ];
    this.products.forEach(p => worksheet.addRow(p));
    worksheet.getRow(1).font = { bold: true };
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'productos.xlsx');
    });
  }
}
