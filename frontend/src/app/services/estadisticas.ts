import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadisticaEquipo, EstadisticaJugador } from '../models/estadistica';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private apiUrl = 'http://localhost:8000/api/estadisticas';

  constructor(private http: HttpClient) {}

  getEstadisticasEquipos(): Observable<EstadisticaEquipo[]> {
    return this.http.get<EstadisticaEquipo[]>(`${this.apiUrl}/equipos/`);
  }

  getEstadisticaEquipo(idEquipo: number): Observable<EstadisticaEquipo> {
    return this.http.get<EstadisticaEquipo>(`${this.apiUrl}/equipos/?idEquipo=${idEquipo}`);
  }

  getEstadisticasJugadores(): Observable<EstadisticaJugador[]> {
    return this.http.get<EstadisticaJugador[]>(`${this.apiUrl}/jugadores/`);
  }

  getEstadisticaJugador(idJugador: number): Observable<EstadisticaJugador> {
    return this.http.get<EstadisticaJugador>(`${this.apiUrl}/jugadores/?idJugador=${idJugador}`);
  }
}
