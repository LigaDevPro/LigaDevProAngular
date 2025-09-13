import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  summaryCards = [
    { title: 'Torneos Activos', value: 5, bgClass: 'bg-green' },
    { title: 'Equipos Registrados', value: 28, bgClass: 'bg-dark-green' },
    { title: 'Partidos Jugados', value: 43, bgClass: 'bg-light-green' },
  ];

  recentMatches = [
    {
      date: '10/05/2025',
      teamA: 'Los Pumas',
      teamB: 'Águilas FC',
      result: '2 - 1',
      status: 'Finalizado',
      statusClass: 'bg-success',
    },
    {
      date: '11/05/2025',
      teamA: 'Tiburones',
      teamB: 'Leones',
      result: '1 - 3',
      status: 'Finalizado',
      statusClass: 'bg-success',
    },
    {
      date: '13/05/2025',
      teamA: 'Furia Roja',
      teamB: 'Dragones',
      result: '-',
      status: 'Programado',
      statusClass: 'bg-warning text-dark',
    },
  ];

  teams = [
    { id: 1, name: 'Furia Roja', coach: 'Juan Pérez' },
    { id: 2, name: 'Leones', coach: 'Ana Gómez' },
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard - Gestión de Torneos');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Panel de control para gestionar torneos, equipos y partidos',
      },
      { property: 'og:title', content: 'Dashboard - Gestión de Torneos' },
      {
        property: 'og:description',
        content: 'Administra tus torneos y equipos desde un solo lugar',
      },
    ]);
  }
}
