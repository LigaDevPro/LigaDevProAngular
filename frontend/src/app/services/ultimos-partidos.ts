import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partido } from '../models/partido';

@Injectable({
  providedIn: 'root',
})
export class UltimosPartidos {
  private url = 'http://localhost:8000/api/partidos/';

  constructor(private http: HttpClient) {}

  getUltimosPartidos(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.url);
  }
}
