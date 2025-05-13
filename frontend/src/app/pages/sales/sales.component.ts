import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SalesService } from '../../services/sale.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit {
  sales: any[] = [];
  mostrarTabla = true;

  constructor(private saleService: SalesService) {}

  ngOnInit(): void {
    this.saleService.getSales().subscribe(data => {
      this.sales = data;
    });

    window.addEventListener('toggleSalesTable', () => {
      this.mostrarTabla = !this.mostrarTabla;
    });
  }
}
