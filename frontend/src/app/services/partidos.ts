import { Injectable } from '@angular/core';
import { Partido } from '../models/partido';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Partidos {
  url = 'http://localhost:3000/partidos';

  constructor(private http: HttpClient) {}

  createMatch(match: Omit<Partido, 'id'>): Observable<Partido> {
    return this.http.post<Partido>(this.url, match);
  }

  getMatches(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.url);
  }
}
