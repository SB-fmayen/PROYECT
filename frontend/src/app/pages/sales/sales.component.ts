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
import * as XLSX from 'xlsx';

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

  selectedSale: Sale | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addModal', { static: false }) addModal!: ElementRef;
  @ViewChild('uploadModal', { static: false }) uploadModal!: ElementRef;
  @ViewChild('editModal', { static: false }) editModal!: ElementRef;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;

  constructor(private salesService: SalesService, public modal: NgbModal) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.salesService.getAllSales(this.filtro).subscribe(data => this.sales = data);
  }

  clearFilters(): void {
    this.filtro = {
      search: '',
      id: '',
      fromDate: '',
      productoId: '',
      clienteId: '',
      empleadoId: ''
    };
    this.loadSales();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'csv':
      case 'xlsx':
      case 'pdf':
        this.uploadFile(file, extension);
        break;
      default:
        alert('Formato no soportado. Solo se permiten archivos CSV, XLSX y PDF.');
    }
  }

uploadFile(file: File, type: string): void {
  this.salesService.uploadFile(file, type).subscribe({
    next: (res: any) => {
      console.log('✅ Archivo cargado:', res);

      // Verifica si el mensaje del backend indica éxito
      if (
        res.message?.includes('exitosamente') ||
        res.message?.includes('insertadas')
      ) {
        this.loadSales(); // Recargar la tabla
      } else {
        alert('Archivo cargado pero sin datos válidos.');
      }

      // Cerrar modal si está abierto y resetear progreso
      this.modal.dismissAll();
      this.uploadProgress = -1;
    },
    error: (err: any) => {
      console.error('❌ Error al subir archivo:', err);
      alert('Error al subir archivo. Revisa el formato o intenta nuevamente.');
      this.uploadProgress = -1;
    }
  });
}


  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = extension === 'csv' || extension === 'xlsx' || extension === 'pdf' ? extension : 'csv';

      this.uploadProgress = 0;
      this.salesService.uploadFile(file, type).subscribe(evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.uploadProgress = Math.round(100 * evt.loaded / evt.total);
        } else if (evt.type === HttpEventType.Response) {
          this.uploadProgress = -1;
          this.loadSales();
          this.modal.dismissAll();
        }
      });
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const head = [['ID', 'Fecha', 'Prod', 'Cli', 'Emp', 'Cant', 'Precio U.', 'Total']];
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

  openUploadModal(): void {
    this.modal.open(this.uploadModal, { centered: true });
  }

  calcularTotal(): void {
    this.newSale.total =
      (this.newSale.cantidad * this.newSale.precioUnitario) - (this.newSale.descuento ?? 0);
  }

  saveSale(form: NgForm): void {
    if (form.invalid) return;

    if (
      this.newSale.cantidad <= 0 ||
      this.newSale.precioUnitario <= 0 ||
      (this.newSale.descuento ?? 0) < 0
    ) {
      alert('Por favor verifica que los valores sean válidos (cantidad, precio, descuento).');
      return;
    }

    this.newSale.total =
      (this.newSale.cantidad * this.newSale.precioUnitario) - (this.newSale.descuento ?? 0);

    this.salesService.createSale(this.newSale).subscribe({
      next: () => {
        this.modal.dismissAll();
        this.loadSales();
        form.resetForm();
      },
      error: err => {
        console.error('Error al guardar venta:', err);
        alert('Ocurrió un error al guardar la venta.');
      }
    });
  }

  editarVenta(sale: Sale): void {
    this.selectedSale = { ...sale };
    this.modal.open(this.editModal, { size: 'lg' });
  }

  guardarEdicion(): void {
    if (!this.selectedSale) return;
    this.salesService.updateSale(this.selectedSale.id, this.selectedSale).subscribe({
      next: () => {
        this.modal.dismissAll();
        this.loadSales();
      },
      error: err => {
        console.error('Error al actualizar venta:', err);
        alert('Ocurrió un error al actualizar la venta.');
      }
    });
  }

  abrirDeleteModal(sale: Sale): void {
    this.selectedSale = sale;
    this.modal.open(this.deleteModal, { centered: true });
  }

  confirmarBorrado(): void {
    if (!this.selectedSale) return;
    this.salesService.deleteSale(this.selectedSale.id).subscribe({
      next: () => {
        this.modal.dismissAll();
        this.loadSales();
      },
      error: err => {
        console.error('Error al eliminar venta:', err);
        alert('No se pudo eliminar la venta.');
      }
    });
  }
}
