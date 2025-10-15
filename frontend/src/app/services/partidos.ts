import { Injectable } from '@angular/core';
import { Partido } from '../models/partido';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Partidos {
  url = 'http://localhost:8000/api/partidos/';

  constructor(private http: HttpClient) {}

  createMatch(match: Omit<Partido, 'idPartido'>): Observable<Partido> {
    return this.http.post<Partido>(this.url, match);
  }

  getMatches(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.url);
  }

  getMatch(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${this.url}${id}/`);
  }

  updateMatch(id: number, match: Partial<Partido>): Observable<Partido> {
    return this.http.put<Partido>(`${this.url}${id}/`, match);
  }

  deleteMatch(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
}
