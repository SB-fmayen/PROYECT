// services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductFilters {
  name?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  basePrice: number;
  cost: number;
  margin: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private baseUrl = 'http://localhost:3000/api/v1/products';

  constructor(private http: HttpClient) {}

  getAllProducts(filters: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.name)         params = params.set('name',         filters.name);
    if (filters.categoryId)   params = params.set('categoryId',   filters.categoryId);
    if (filters.minPrice)     params = params.set('minPrice',     filters.minPrice);
    if (filters.maxPrice)     params = params.set('maxPrice',     filters.maxPrice);
    if (filters.fechaInicio)  params = params.set('fechaInicio',  filters.fechaInicio);
    if (filters.fechaFin)     params = params.set('fechaFin',     filters.fechaFin);

    console.log('🌐 GET', this.baseUrl + '?' + params.toString());

    return this.http.get<Product[]>(this.baseUrl, { params });
  }

createProduct(product: any): Observable<any> {
  return this.http.post(this.baseUrl, product);
}

updateProduct(id: string, product: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, product);
}

deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`);
}


}
