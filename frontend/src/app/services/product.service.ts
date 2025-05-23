import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api/v1/products';

  constructor(private http: HttpClient) {}

  getAllProducts(filtro: any): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filtro).forEach(key => {
      if (filtro[key]) {
        params = params.set(key, filtro[key]);
      }
    });

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
