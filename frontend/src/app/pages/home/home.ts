import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  sections = [
    {
      title: 'Bienvenido a la Plataforma de Gestión de Torneos',
      description:
        'Automatizá y organizá tus torneos internos de forma sencilla, profesional y transparente.',
      class: 'main',
      backgroundImage: '/assets/img/image1.png',
    },
    {
      title: 'Gestión Eficiente',
      description: 'Controlá tus equipos, partidos y estadísticas en tiempo real.',
      class: 'section',
      backgroundImage: '/assets/img/image2.png',
    },
    {
      title: 'Visualización Clara',
      description: 'Seguimiento visual y métricas detalladas para tus torneos.',
      class: 'section-two',
      backgroundImage: '/assets/img/image3.png',
    },
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('LigaPro - Gestión de Torneos');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Plataforma para gestionar torneos internos de forma sencilla y profesional',
      },
      { property: 'og:title', content: 'LigaPro - Gestión de Torneos' },
      {
        property: 'og:description',
        content: 'Automatiza y organiza tus torneos con nuestra plataforma',
      },
    ]);
  }
}
