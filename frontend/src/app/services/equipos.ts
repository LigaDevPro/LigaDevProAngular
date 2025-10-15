import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo, CreateEquipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class Equipos {
  private url = 'http://localhost:8000/api/equipos/';

  constructor(private http: HttpClient) {}

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.url);
  }

  createEquipo(equipo: CreateEquipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.url, equipo);
  }

  getEquipo(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.url}${id}/`);
  }

  updateEquipo(id: number, equipo: Partial<CreateEquipo>): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.url}${id}/`, equipo);
  }

  deleteEquipo(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
}
