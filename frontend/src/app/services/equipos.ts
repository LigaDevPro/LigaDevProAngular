import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo, CreateEquipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class Equipos {
  private url = 'http://localhost:3000/equipos';

  constructor(private http: HttpClient) {}

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.url);
  }

  createEquipo(equipo: CreateEquipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.url, equipo);
  }
}
