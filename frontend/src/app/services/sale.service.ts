import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:3000/api/v1/sales';

  constructor(private http: HttpClient) {}

  getAllSales(filtro: any): Observable<any[]> {
    let params = new HttpParams();
if (filtro.customerId) params = params.set('customerId', filtro.customerId);
if (filtro.productId) params = params.set('productId', filtro.productId);
if (filtro.employeeId) params = params.set('employeeId', filtro.employeeId); // 👈 ESTE FALTABA
if (filtro.fechaInicio) params = params.set('fechaInicio', filtro.fechaInicio);
if (filtro.fechaFin) params = params.set('fechaFin', filtro.fechaFin);
if (filtro.paymentMethod) params = params.set('paymentMethod', filtro.paymentMethod);
if (filtro.regionId) params = params.set('regionId', filtro.regionId);
if (filtro.minTotal) params = params.set('minTotal', filtro.minTotal);
if (filtro.maxTotal) params = params.set('maxTotal', filtro.maxTotal);


    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
