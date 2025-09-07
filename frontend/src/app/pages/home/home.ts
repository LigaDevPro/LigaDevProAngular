import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
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

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('LigaPro - Gestión de Torneos');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Plataforma para gestionar torneos internos de forma sencilla y profesional',
      },
      { name: 'keywords', content: 'angular 20, ligapro, torneos, gestión' },
      { property: 'og:title', content: 'LigaPro - Gestión de Torneos' },
      {
        property: 'og:description',
        content: 'Automatiza y organiza tus torneos con nuestra plataforma',
      },
    ]);

    const favicon = this.renderer.createElement('link');
    this.renderer.setAttribute(favicon, 'rel', 'icon');
    this.renderer.setAttribute(favicon, 'href', '/assets/icon/icon.png');
    this.renderer.appendChild(this.document.head, favicon);

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
    const favicon = this.document.querySelector('link[href="/assets/icon/icon.png"]');
    if (favicon) {
      this.renderer.removeChild(this.document.head, favicon);
    }
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
