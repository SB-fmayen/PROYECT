import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ necesario para ngModel
import { HttpClientModule } from '@angular/common/http'; // ✅ necesario para HttpClient
import { RegionService } from '../../services/region.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';



@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {
  regions: any[] = [];
  filtro = {
    city: '',
    country: '',
    createdFrom: '',
    createdTo: ''
  };

  constructor(private regionService: RegionService) {}

  ngOnInit(): void {
    this.obtenerRegiones();
  }

  obtenerRegiones(): void {
    this.filtro.city = this.filtro.city.replace(/\s+/g, ' ').trim();
    this.filtro.country = this.filtro.country.replace(/\s+/g, ' ').trim();

    this.regionService.getFilteredRegions(this.filtro).subscribe({
      next: data => this.regions = data,
      error: err => console.error('Error al cargar regiones:', err)
    });
  }

  filtrar(): void {
    this.obtenerRegiones();
  }

  limpiarFiltros(): void {
    this.filtro = {
      city: '',
      country: '',
      createdFrom: '',
      createdTo: ''
    };
    this.filtrar();
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const headers = [['ID', 'Ciudad', 'Coordenadas', 'País', 'Fecha creación', 'Última actualización']];
    const data = this.regions.map(r => [
      r.id,
      r.city,
      r.coordinates ?? 'N/A',
      r.country,
      r.createdAt,
      r.updatedAt
    ]);
    doc.setFontSize(16);
    doc.text('Listado de Regiones', 40, 40);
    autoTable(doc, { startY: 60, head: headers, body: data, theme: 'grid' });
    doc.save('regiones.pdf');
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Regiones');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Ciudad', key: 'city', width: 25 },
      { header: 'Coordenadas', key: 'coordinates', width: 30 },
      { header: 'País', key: 'country', width: 20 },
      { header: 'Fecha creación', key: 'createdAt', width: 20 },
      { header: 'Última actualización', key: 'updatedAt', width: 20 },
    ];
    this.regions.forEach(r => worksheet.addRow(r));
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'regiones.xlsx');
    });
  }
}
