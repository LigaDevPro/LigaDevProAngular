import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Partidos } from '../../services/partidos';
import { Partido } from '../../models/partido';
import { Equipo } from '../../models/equipo';
import { Equipos } from '../../services/equipos';
import { Torneo } from '../../models/torneo';
import { Torneos } from '../../services/torneos';
import { UltimosPartidos } from '../../services/ultimos-partidos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  matches: Partido[] = [];
  ultimosPartidos: Partido[] = [];
  teams: Equipo[] = [];
  torneosActivos: Torneo[] = [];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private Partidos: Partidos,
    private Equipos: Equipos,
    private Torneos: Torneos,
    private UltimosPartidos: UltimosPartidos
  ) {}
  getUltimosPartidos(): void {
    this.UltimosPartidos.getUltimosPartidos().subscribe({
      next: (data) => {
        this.ultimosPartidos = data || [];
        console.log('✅ Últimos partidos cargados:', this.ultimosPartidos);
      },
      error: (err) => {
        console.error('❌ Error cargando últimos partidos:', err);
        this.ultimosPartidos = [];
      },
    });
  }

  getMatchesAll(): void {
    this.Partidos.getMatches().subscribe({
      next: (data) => {
        this.matches = data || [];
        console.log('✅ Matches cargados:', this.matches);
      },
      error: (err) => {
        console.error('❌ Error cargando matches:', err);
        this.matches = [];
      },
    });
  }

  getEquiposAll(): void {
    this.Equipos.getEquipos().subscribe({
      next: (data) => {
        this.teams = data || [];
        console.log('✅ Equipos cargados:', this.teams);
      },
      error: (err) => {
        console.error('❌ Error cargando equipos:', err);
        this.teams = [];
      },
    });
  }

  get summaryCards() {
    return [
      {
        title: 'Torneos Activos',
        value: this.torneosActivos.length,
        bgClass: 'bg-green',
      },
      {
        title: 'Equipos Registrados',
        value: this.teams.length,
        bgClass: 'bg-dark-green',
      },
      {
        title: 'Partidos Jugados',
        value: this.matches.filter((match) => match.estado === 'Finalizado').length,
        bgClass: 'bg-light-green',
      },
    ];
  }

  getTorneosActivos(): void {
    this.Torneos.getTorneosActivos().subscribe({
      next: (data) => {
        this.torneosActivos = (data || []).filter(
          (t) => t.estado === 'En curso' || t.estado === 'Preparación'
        );
        console.log('✅ Torneos activos cargados:', this.torneosActivos);
      },
      error: (err) => {
        console.error('❌ Error cargando torneos activos:', err);
        this.torneosActivos = [];
      },
    });
  }

  getStatusClass(estado: string, index: number): string {
    switch (estado) {
      case 'Finalizado':
        return 'bg-success';
      case 'En curso':
        return 'bg-primary';
      case 'Preparación':
        return 'bg-warning';
      case 'Cancelado':
        return 'bg-danger';
      default:
        return index % 2 === 0 ? 'bg-info' : 'bg-secondary';
    }
  }

  ngOnInit(): void {
    console.log('🚀 Dashboard inicializado - Cargando datos...');
    console.log('📡 Backend URL: http://localhost:8000/api/');

    this.getMatchesAll();
    this.getEquiposAll();
    this.getTorneosActivos();
    this.getUltimosPartidos();

    // Verificar después de 2 segundos si hay datos
    setTimeout(() => {
      console.log('📊 Estado actual:');
      console.log('  - Matches:', this.matches.length);
      console.log('  - Equipos:', this.teams.length);
      console.log('  - Torneos:', this.torneosActivos.length);
      console.log('  - Últimos partidos:', this.ultimosPartidos.length);
    }, 2000);

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
