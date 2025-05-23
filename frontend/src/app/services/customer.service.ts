import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiUrl = 'http://localhost:3000/api/v1/customers';

  constructor(private http: HttpClient) {}

  getAllCustomers(filtros: any = {}): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(filtros).forEach(key => {
      if (filtros[key]) {
        params = params.set(key, filtros[key]);
      }
    });

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
