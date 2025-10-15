import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { Partidos } from '../../services/partidos';
import { Partido } from '../../models/partido';
import { Equipo } from '../../models/equipo';
import { Equipos } from '../../services/equipos';
import { Torneo } from '../../models/torneo';
import { Torneos } from '../../services/torneos';
import { UltimosPartidos } from '../../services/ultimos-partidos';
import { Auth } from '../../services/auth';
import { NotificacionService } from '../../services/notificacion';
import { EstadisticasService } from '../../services/estadisticas';
import { EstadisticaEquipo, EstadisticaJugador } from '../../models/estadistica';
import { Jugador } from '../../models/jugador';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-usuario.html',
  styleUrls: ['./dashboard-usuario.css'],
})
export class DashboardUsuario implements OnInit {
  matches: Partido[] = [];
  ultimosPartidos: Partido[] = [];
  teams: Equipo[] = [];
  torneosActivos: Torneo[] = [];
  nombreUsuario = '';

  // Variables para modal de detalle
  mostrarModalDetalle = false;
  tipoDetalle: 'equipo' | 'partido' | 'jugador' | 'torneo' | null = null;
  equipoDetalle: Equipo | null = null;
  partidoDetalle: Partido | null = null;
  jugadorDetalle: Jugador | null = null;
  torneoDetalle: Torneo | null = null;
  equiposTorneo: Equipo[] = [];
  partidosTorneo: Partido[] = [];
  estadisticaEquipo: EstadisticaEquipo | null = null;
  estadisticaJugador: EstadisticaJugador | null = null;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private Partidos: Partidos,
    private Equipos: Equipos,
    private Torneos: Torneos,
    private UltimosPartidos: UltimosPartidos,
    private authService: Auth,
    private router: Router,
    private notificacion: NotificacionService,
    private estadisticasService: EstadisticasService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.notificacion.warning('Debes iniciar sesión para acceder');
      this.router.navigate(['/login']);
      return;
    }

    // Si es admin, redirigir al dashboard admin
    if (this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    const usuario = this.authService.getCurrentUser();
    this.nombreUsuario = usuario?.username || 'Usuario';


    this.getMatchesAll();
    this.getEquiposAll();
    this.getTorneosActivos();
    this.getUltimosPartidos();

    this.titleService.setTitle('Mi Dashboard - LigaDevPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Panel de usuario para ver torneos, equipos y partidos',
      },
      { property: 'og:title', content: 'Dashboard Usuario - LigaDevPro' },
      {
        property: 'og:description',
        content: 'Consulta información de torneos y equipos',
      },
    ]);
  }

  getUltimosPartidos(): void {
    this.UltimosPartidos.getUltimosPartidos().subscribe({
      next: (data) => {
        this.ultimosPartidos = data || [];
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

  // ==================== ACCIONES DE VISUALIZACIÓN ====================

  verEquipo(id: number): void {

    this.Equipos.getEquipo(id).subscribe({
      next: (equipo) => {
        this.equipoDetalle = equipo;

        // Obtener estadísticas del equipo
        this.estadisticasService.getEstadisticasEquipos().subscribe({
          next: (estadisticas) => {
            this.estadisticaEquipo = estadisticas.find((e) => e.idEquipo === id) || null;
            this.tipoDetalle = 'equipo';
            this.mostrarModalDetalle = true;
          },
          error: (err) => {
            console.error('Error al cargar estadísticas:', err);
            this.tipoDetalle = 'equipo';
            this.mostrarModalDetalle = true;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar equipo:', err);
        this.notificacion.error('Error al cargar los detalles del equipo');
      },
    });
  }

  verJugador(jugador: Jugador): void {
    this.jugadorDetalle = jugador;

    // Obtener estadísticas del jugador
    this.estadisticasService.getEstadisticasJugadores().subscribe({
      next: (estadisticas) => {
        this.estadisticaJugador = estadisticas.find((e) => e.idJugador === jugador.idJugador) || null;
        this.tipoDetalle = 'jugador';
        this.mostrarModalDetalle = true;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas del jugador:', err);
        this.tipoDetalle = 'jugador';
        this.mostrarModalDetalle = true;
      },
    });
  }

  verTorneo(id: number): void {

    this.Torneos.getTorneosActivos().subscribe({
      next: (torneos) => {
        const torneo = torneos.find((t) => t.idTorneo === id);
        if (torneo) {
          this.torneoDetalle = torneo;

          // Obtener todos los partidos del torneo
          this.UltimosPartidos.getUltimosPartidos().subscribe({
            next: (partidos) => {
              this.partidosTorneo = partidos.filter((p) => p.idTorneo === id);

              // Obtener equipos únicos de los partidos
              const equipoIds = new Set<number>();
              this.partidosTorneo.forEach((p) => {
                equipoIds.add(p.idEquipoLocal);
                equipoIds.add(p.idEquipoVisitante);
              });

              // Obtener todos los equipos
              this.Equipos.getEquipos().subscribe({
                next: (equipos) => {
                  this.equiposTorneo = equipos.filter((e) => equipoIds.has(e.idEquipo));
                  this.tipoDetalle = 'torneo';
                  this.mostrarModalDetalle = true;
                },
                error: (err) => {
                  console.error('Error al cargar equipos:', err);
                  this.tipoDetalle = 'torneo';
                  this.mostrarModalDetalle = true;
                },
              });
            },
            error: (err) => {
              console.error('Error al cargar partidos:', err);
              this.tipoDetalle = 'torneo';
              this.mostrarModalDetalle = true;
            },
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar torneo:', err);
        this.notificacion.error('Error al cargar los detalles del torneo');
      },
    });
  }

  verPartido(id: number): void {

    this.Partidos.getMatch(id).subscribe({
      next: (partido) => {
        this.partidoDetalle = partido;
        this.tipoDetalle = 'partido';
        this.mostrarModalDetalle = true;
      },
      error: (err) => {
        console.error('Error al cargar partido:', err);
        this.notificacion.error('Error al cargar los detalles del partido');
      },
    });
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.tipoDetalle = null;
    this.equipoDetalle = null;
    this.partidoDetalle = null;
    this.jugadorDetalle = null;
    this.torneoDetalle = null;
    this.equiposTorneo = [];
    this.partidosTorneo = [];
    this.estadisticaEquipo = null;
    this.estadisticaJugador = null;
  }
}
