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
    this.UltimosPartidos.getUltimosPartidos().subscribe((data) => {
      this.ultimosPartidos = data;
    });
  }

  getMatchesAll(): void {
    this.Partidos.getMatches().subscribe((data) => {
      this.matches = data;
    });
  }

  getEquiposAll(): void {
    this.Equipos.getEquipos().subscribe((data) => {
      this.teams = data;
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
        value: this.matches.filter((match) => match.status === 'Finalizado').length,
        bgClass: 'bg-light-green',
      },
    ];
  }

  getTorneosActivos(): void {
    this.Torneos.getTorneosActivos().subscribe((data) => {
      this.torneosActivos = data;
    });
  }

  ngOnInit(): void {
    this.getMatchesAll();
    this.getEquiposAll();
    this.getTorneosActivos();
    this.getUltimosPartidos();

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
