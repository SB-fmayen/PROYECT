import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesService, Sale, CreateSaleDTO } from '../../services/sale.service';
import { HttpEventType } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  filtro = {
    search: '',
    id: '',
    fromDate: '',
    toDate: '',
    productoId: '',
    clienteId: '',
    empleadoId: ''
  };
  showFilter = false;
  uploadProgress = -1;

  newSale: CreateSaleDTO = {
    id: '', fechaVenta: '', productoId: '', clienteId: '', empleadoId: '',
    cantidad: 1, precioUnitario: 0, total: 0, descuento: 0, metodoPago: '', regionId: ''
  };

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addModal', { static: false }) addModal!: ElementRef;

  constructor(private svc: SalesService, public modal: NgbModal) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.svc.getAllSales(this.filtro).subscribe(data => this.sales = data);
  }

  clearFilters(): void {
    this.filtro = {
      search: '',
      id: '',
      fromDate: '',
      toDate: '',
      productoId: '',
      clienteId: '',
      empleadoId: ''
    };
    this.loadSales();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadProgress = 0;
    this.svc.uploadFile(file).subscribe(evt => {
      if (evt.type === HttpEventType.UploadProgress && evt.total) {
        this.uploadProgress = Math.round(100 * evt.loaded / evt.total);
      } else if (evt.type === HttpEventType.Response) {
        this.uploadProgress = -1;
        this.loadSales();
      }
    });
  }

  exportToPDF(): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const head = [['ID','Fecha','Prod','Cli','Emp','Cant','Precio U.','Total']];
    const body = this.sales.map(s => [
      s.id,
      new Date(s.fechaVenta).toLocaleString(),
      s.productoId,
      s.clienteId,
      s.empleadoId,
      s.cantidad,
      s.precioUnitario,
      s.total
    ]);
    autoTable(doc, { head, body, startY: 40 });
    doc.save('ventas.pdf');
  }

  exportToExcel(): void {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Ventas');
    ws.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Fecha', key: 'fechaVenta' },
      { header: 'Producto', key: 'productoId' },
      { header: 'Cliente', key: 'clienteId' },
      { header: 'Empleado', key: 'empleadoId' },
      { header: 'Cantidad', key: 'cantidad' },
      { header: 'Precio U.', key: 'precioUnitario' },
      { header: 'Total', key: 'total' }
    ];
    this.sales.forEach(row => ws.addRow(row as any));
    wb.xlsx.writeBuffer().then(buf => FileSaver.saveAs(new Blob([buf]), 'ventas.xlsx'));
  }

  openAddModal(): void {
    this.modal.open(this.addModal, { size: 'lg' });
  }

  saveSale(form: NgForm): void {
    if (form.invalid) return;
    this.svc.createSale(this.newSale).subscribe(() => {
      this.modal.dismissAll();
      this.loadSales();
      form.resetForm();
    });
  }
}
