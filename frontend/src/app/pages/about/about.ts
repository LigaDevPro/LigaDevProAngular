import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements OnInit {
  teamMembers = [
    {
      name: 'Miguel Ivan Scaccia',
      role: 'Desarrollador Full stack',
      bio: 'Especialista en crear interfaces intuitivas y atractivas con amplia experiencia en HTML, CSS y JavaScript.',
      image: '/img/image7.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/miguel-ivan-scaccia/',
        github: 'https://github.com/MiguelSc66',
        portfolio: '#',
      },
    },
    {
      name: 'Rodrigo Rojas',
      role: 'Desarrollador Full stack',
      bio: 'Experto en arquitectura de sistemas y bases de datos con enfoque en soluciones escalables y seguras.',
      image: '/img/image10.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/rodrigo-rojas-87312b297/',
        github: 'https://github.com/Rodri1989',
        portfolio: '#',
      },
    },
    {
      name: 'Agustin Emanuel Ceballos',
      role: 'Desarrollador Full stack',
      bio: 'Creativo apasionado por diseñar experiencias de usuario memorables y funcionales que conectan con las personas.',
      image: '/img/image8.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/agustin-ceballos/',
        github: 'https://github.com/Agustin197',
        portfolio: '#',
      },
    },
    {
      name: 'Ignacio Matías Cantoni',
      role: 'Desarrollador Full stack',
      bio: 'Organizador nato con habilidad para coordinar equipos y garantizar que los proyectos se entreguen a tiempo y dentro del presupuesto.',
      image: '/img/image6.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/ignacio-cantoni-459136216/',
        github: 'https://github.com/IgnacioCantoni',
        portfolio: '#',
      },
    },
    {
      name: 'Pablo Emanuel Peralta',
      role: 'Desarrollador Full stack',
      bio: 'Estratega de marketing digityal con experiencia en campañas que generan resultados tangibles y aumentan la visibilidad.',
      image: '/img/image11.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/pabloperalta-keepcoding/',
        github: 'https://github.com/Pablo4604',
        portfolio: 'portfolio/Pablo Peralta/index.html',
      },
    },
    {
      name: 'Juan Manuel Machado',
      role: 'Desarrollador Full stack',
      bio: 'Experto en análisis de datos y estadísticas que transforma información compleja en insights accionables.',
      image: '/img/image9.png',
      social: {
        linkedin: 'https://ar.linkedin.com/in/juan-manuel-machado-b472a0363',
        github: 'https://github.com/JuanmaDS13',
        portfolio: '#',
      },
    },
  ];

  values = [
    {
      title: 'Pasión',
      description: 'El fútbol es más que un juego; es una forma de vida que une a las personas.',
      icon: '/img/passionate.png',
    },
    {
      title: 'Comunidad',
      description: 'Creemos en el poder del fútbol para construir comunidades fuertes.',
      icon: '/img/people.png',
    },
    {
      title: 'Juego limpio',
      description: 'Promovemos el respeto, la honestidad y la deportividad.',
      icon: '/img/football.png',
    },
  ];

  testimonials = [
    {
      name: 'Juan Pérez',
      text: 'Participar en los torneos fue una experiencia increíble...',
      image: '/img/fotoUsuario.png',
    },
    {
      name: 'Marío González',
      text: 'Participar en los torneos fue una experiencia increíble...',
      image: '/img/fotoUsuario.png',
    },
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Sobre Nosotros');
    this.metaService.addTags([
      { property: 'og:title', content: 'Sobre Nosotros' },
      { property: 'og:description', content: 'Descubre quiénes somos y nuestros valores' },
    ]);
  }
}
