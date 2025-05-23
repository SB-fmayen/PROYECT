import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/v1/employees';

  constructor(private http: HttpClient) {}

  getFilteredEmployees(filtro: any): Observable<any[]> {
    let params = new HttpParams();

    if (filtro.name) params = params.set('name', filtro.name.trim().toLowerCase());
if (filtro.department) {
  params = params.set('department', filtro.department.trim().toUpperCase());
}
if (filtro.name) {
  params = params.set('name', filtro.name.trim().toLowerCase());
}


if (filtro.department) {
  params = params.set('department', filtro.department.trim().toUpperCase()); // solo aquí
}


    if (filtro.createdTo) params = params.set('createdTo', filtro.createdTo);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
