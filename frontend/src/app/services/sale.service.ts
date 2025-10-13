import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
          } catch {
            // Ignorar fecha inválida
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

  updateSale(id: string, payload: Partial<Sale>): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/${id}`, payload);
  }

  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadFile(file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file); // 👈🏻 campo correcto para que coincida con backend

    return this.http.post(`${this.apiUrl}/upload/${type}`, formData);
  }
}
