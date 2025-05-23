import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/v1/users'; // ✅ Ruta unificada

  constructor(private http: HttpClient) {}

  getFilteredUsers(filtro: any): Observable<any[]> {
    let params = new HttpParams();

    // ✅ Sanitiza y convierte a minúsculas
    if (filtro.name) params = params.set('name', filtro.name.trim().toLowerCase());
    if (filtro.email) params = params.set('email', filtro.email.trim().toLowerCase());
    if (filtro.roleId) params = params.set('roleId', filtro.roleId);
    if (filtro.isActive !== undefined && filtro.isActive !== '') {
      params = params.set('isActive', filtro.isActive);
    }
    if (filtro.createdFrom) params = params.set('createdFrom', filtro.createdFrom);
    if (filtro.createdTo) params = params.set('createdTo', filtro.createdTo);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}