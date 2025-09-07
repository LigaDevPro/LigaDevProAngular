import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
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

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

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

    const bootstrapLink = this.renderer.createElement('link');
    this.renderer.setAttribute(bootstrapLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(
      bootstrapLink,
      'href',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
    );
    this.renderer.appendChild(this.document.head, bootstrapLink);

    const bootstrapScript = this.renderer.createElement('script');
    this.renderer.setAttribute(
      bootstrapScript,
      'src',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
    );
    this.renderer.appendChild(this.document.body, bootstrapScript);
  }

  ngOnDestroy(): void {
    const bootstrapLink = this.document.querySelector(
      'link[href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"]'
    );
    if (bootstrapLink) {
      this.renderer.removeChild(this.document.head, bootstrapLink);
    }
    const bootstrapScript = this.document.querySelector(
      'script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"]'
    );
    if (bootstrapScript) {
      this.renderer.removeChild(this.document.body, bootstrapScript);
    }
  }
}
