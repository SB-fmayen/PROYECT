// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateUserDTO {
  nombre: string;
  correo: string;
  rolId: number;
  activo: boolean;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl   = 'http://localhost:3000/api/v1/users';
  private rolesUrl = 'http://localhost:3000/api/v1/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(this.rolesUrl);
  }

  getFilteredUsers(filtro: any): Observable<User[]> {
    let params = new HttpParams();
    Object.entries(filtro).forEach(([k, v]) => {
      if (v !== '' && v != null) {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  uploadUsersCSV(file: File): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<HttpEvent<any>>(
      `${this.apiUrl}/upload`,
      form,
      { reportProgress: true, observe: 'events' }
    );
  }

  updateUser(id: number, payload: CreateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
