import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/api/v1/categories';

  constructor(private http: HttpClient) {}

  getFilteredCategories(filtro: any): Observable<any[]> {
    let params = new HttpParams();

    if (filtro.name) {
      params = params.set('name', filtro.name.trim().toLowerCase());
    }
    if (filtro.createdFrom) {
      params = params.set('createdFrom', filtro.createdFrom);
    }
    if (filtro.createdTo) {
      params = params.set('createdTo', filtro.createdTo);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
