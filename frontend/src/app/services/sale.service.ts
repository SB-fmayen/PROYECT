import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  id: string;
  fechaVenta: string;
  productoId: string;
  clienteId: string;
  empleadoId: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  descuento?: number;
  metodoPago: string;
  regionId: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface CreateSaleDTO {
  id: string;
  fechaVenta: string;
  productoId: string;
  clienteId: string;
  empleadoId: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  descuento?: number;
  metodoPago: string;
  regionId: string;
}

@Injectable({ providedIn: 'root' })
export class SalesService {
  private apiUrl = 'http://localhost:3000/api/v1/sales';

  constructor(private http: HttpClient) {}

  getAllSales(filtro: any): Observable<Sale[]> {
    let params = new HttpParams();

    Object.entries(filtro).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        if (key === 'fromDate' && typeof value === 'string') {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              const iso = date.toISOString().split('T')[0]; // YYYY-MM-DD
              params = params.set('fromDate', iso);
            }
          } catch (error) {
            console.warn('Fecha inválida:', value);
          }
        } else {
          params = params.set(key, String(value));
        }
      }
    });

    return this.http.get<Sale[]>(this.apiUrl, { params });
  }

  createSale(payload: CreateSaleDTO): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, payload);
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file);

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, form, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
