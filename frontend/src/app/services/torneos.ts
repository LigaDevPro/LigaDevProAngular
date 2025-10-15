import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneo, CreateTorneo } from '../models/torneo';

@Injectable({
  providedIn: 'root',
})
export class Torneos {
  private apiUrl = 'http://localhost:8000/api/torneos/';

  constructor(private http: HttpClient) {}

  getTorneos(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  createTorneo(torneo: CreateTorneo): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo);
  }

  getTorneosActivos(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  getTorneo(id: number): Observable<Torneo> {
    return this.http.get<Torneo>(`${this.apiUrl}${id}/`);
  }

  updateTorneo(id: number, torneo: Partial<CreateTorneo>): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}${id}/`, torneo);
  }

  deleteTorneo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
