import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private apiUrl = 'http://localhost:3000/api/v1/regions';

  constructor(private http: HttpClient) {}

  getFilteredRegions(filtro: any): Observable<any[]> {
    let params = new HttpParams();

    if (filtro.city) params = params.set('city', filtro.city.trim().toLowerCase());
    if (filtro.country) params = params.set('country', filtro.country.trim().toLowerCase());
    if (filtro.createdFrom) params = params.set('createdFrom', filtro.createdFrom);
    if (filtro.createdTo) params = params.set('createdTo', filtro.createdTo);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
