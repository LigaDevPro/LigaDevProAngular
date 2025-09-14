import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneo } from '../models/torneo';

@Injectable({
  providedIn: 'root',
})
export class Torneos {
  private apiUrl = 'http://localhost:3000/torneos';

  constructor(private http: HttpClient) {}

  getTorneos(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  createTorneo(torneo: Torneo): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo);
  }

  getTorneosActivos(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(`${this.apiUrl}?estado=activo`);
  }
}
