#!/usr/bin/env python
"""
Script para probar la base de datos con datos de prueba
"""

import os
import django
from datetime import date, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ligadevpro_backend.settings')
django.setup()

from proyect.models import (
    Rol, Usuario, Equipo, EstadisticaEquipo, Torneo, Partido, 
    Resultado, Jugador, EstadisticaJugador, TablaPosiciones, Posicion
)


def limpiar_base_datos():
    """Elimina todos los datos existentes"""
    print("\n🗑️  Limpiando base de datos...")
    
    Posicion.objects.all().delete()
    TablaPosiciones.objects.all().delete()
    EstadisticaJugador.objects.all().delete()
    Jugador.objects.all().delete()
    Resultado.objects.all().delete()
    Partido.objects.all().delete()
    EstadisticaEquipo.objects.all().delete()
    Equipo.objects.all().delete()
    Torneo.objects.all().delete()
    Usuario.objects.all().delete()
    Rol.objects.all().delete()
    
    print("✅ Base de datos limpia")


def crear_roles():
    """Crea los roles básicos"""
    print("\n👥 Creando roles...")
    
    roles_data = [
        {'nombre': 'Administrador', 'descripcion': 'Acceso total al sistema'},
        {'nombre': 'Jugador', 'descripcion': 'Usuario jugador de equipos'},
        {'nombre': 'Entrenador', 'descripcion': 'Entrenador de equipos'},
        {'nombre': 'Árbitro', 'descripcion': 'Árbitro de partidos'},
    ]
    
    roles = []
    for data in roles_data:
        rol, created = Rol.objects.get_or_create(
            nombre=data['nombre'],
            defaults={'descripcion': data['descripcion']}
        )
        roles.append(rol)
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {rol.nombre}")
    
    return roles


def crear_usuarios(roles):
    """Crea usuarios de prueba"""
    print("\n👤 Creando usuarios...")
    
    usuarios_data = [
        {
            'username': 'admin',
            'email': 'admin@ligadevpro.com',
            'password': 'admin123',
            'nombre': 'Administrador',
            'apellido': 'Sistema',
            'rol': roles[0]  # Administrador
        },
        {
            'username': 'jperez',
            'email': 'jperez@email.com',
            'password': 'jugador123',
            'nombre': 'Juan',
            'apellido': 'Pérez',
            'rol': roles[1]  # Jugador
        },
        {
            'username': 'mgarcia',
            'email': 'mgarcia@email.com',
            'password': 'jugador123',
            'nombre': 'María',
            'apellido': 'García',
            'rol': roles[1]  # Jugador
        },
        {
            'username': 'lmartinez',
            'email': 'lmartinez@email.com',
            'password': 'jugador123',
            'nombre': 'Luis',
            'apellido': 'Martínez',
            'rol': roles[1]  # Jugador
        },
        {
            'username': 'alopez',
            'email': 'alopez@email.com',
            'password': 'jugador123',
            'nombre': 'Ana',
            'apellido': 'López',
            'rol': roles[1]  # Jugador
        },
        {
            'username': 'crodriguez',
            'email': 'crodriguez@email.com',
            'password': 'entrenador123',
            'nombre': 'Carlos',
            'apellido': 'Rodríguez',
            'rol': roles[2]  # Entrenador
        },
    ]
    
    usuarios = []
    for data in usuarios_data:
        try:
            usuario = Usuario.objects.get(email=data['email'])
            print(f"  📝 Existe: {usuario.username}")
        except Usuario.DoesNotExist:
            usuario = Usuario.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                rol_id=data['rol']
            )
            print(f"  ✅ Creado: {usuario.username} ({usuario.email})")
        
        usuarios.append(usuario)
    
    return usuarios


def crear_equipos(usuarios):
    """Crea equipos de prueba"""
    print("\n⚽ Creando equipos...")
    
    equipos_data = [
        {'nombre': 'River Plate', 'entrenador': 'Marcelo Gallardo'},
        {'nombre': 'Boca Juniors', 'entrenador': 'Jorge Almirón'},
        {'nombre': 'Racing Club', 'entrenador': 'Fernando Gago'},
        {'nombre': 'Independiente', 'entrenador': 'Julio Falcioni'},
    ]
    
    equipos = []
    for i, data in enumerate(equipos_data):
        equipo, created = Equipo.objects.get_or_create(
            nombre=data['nombre'],
            defaults={'entrenador': data['entrenador']}
        )
        
        # Asignar usuarios al equipo (si hay disponibles)
        if created and i < len(usuarios) - 1:
            equipo.idUsuario.add(usuarios[i + 1])  # Asignar un usuario por equipo
        
        equipos.append(equipo)
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {equipo.nombre}")
    
    return equipos


def crear_jugadores(usuarios, equipos):
    """Crea jugadores de prueba"""
    print("\n🏃 Creando jugadores...")
    
    jugadores_data = [
        # River Plate
        {'usuario': usuarios[1], 'nombre': 'Juan', 'apellido': 'Pérez', 'numeroPosicion': 1, 'posicion': 'arquero', 'equipo': equipos[0]},
        {'usuario': usuarios[2], 'nombre': 'María', 'apellido': 'García', 'numeroPosicion': 5, 'posicion': 'defensor', 'equipo': equipos[0]},
        # Boca Juniors
        {'usuario': usuarios[3], 'nombre': 'Luis', 'apellido': 'Martínez', 'numeroPosicion': 10, 'posicion': 'mediocampo', 'equipo': equipos[1]},
        # Racing Club
        {'usuario': usuarios[4], 'nombre': 'Ana', 'apellido': 'López', 'numeroPosicion': 9, 'posicion': 'delantero', 'equipo': equipos[2]},
    ]
    
    jugadores = []
    for data in jugadores_data:
        jugador, created = Jugador.objects.get_or_create(
            idUsuario=data['usuario'],
            defaults={
                'nombre': data['nombre'],
                'apellido': data['apellido'],
                'numeroPosicion': data['numeroPosicion'],
                'posicion': data['posicion'],
                'idEquipo': data['equipo']
            }
        )
        jugadores.append(jugador)
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {jugador.nombre} {jugador.apellido} - {jugador.idEquipo.nombre}")
    
    return jugadores


def crear_torneos():
    """Crea torneos de prueba"""
    print("\n🏆 Creando torneos...")
    
    torneos_data = [
        {
            'nombre': 'Liga Profesional 2024',
            'descripcion': 'Torneo de primera división',
            'formato': 'Liga',
            'fechaInicio': date(2024, 1, 15),
            'fechaFinal': date(2024, 12, 15),
            'estado': 'En curso'
        },
        {
            'nombre': 'Copa Argentina 2024',
            'descripcion': 'Torneo de copa nacional',
            'formato': 'Eliminatoria',
            'fechaInicio': date(2024, 2, 1),
            'fechaFinal': date(2024, 11, 30),
            'estado': 'Preparación'
        },
    ]
    
    torneos = []
    for data in torneos_data:
        torneo, created = Torneo.objects.get_or_create(
            nombre=data['nombre'],
            defaults={
                'descripcion': data['descripcion'],
                'formato': data['formato'],
                'fechaInicio': data['fechaInicio'],
                'fechaFinal': data['fechaFinal'],
                'estado': data['estado']
            }
        )
        torneos.append(torneo)
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {torneo.nombre}")
    
    return torneos


def crear_partidos(equipos, torneos):
    """Crea partidos de prueba"""
    print("\n⚽ Creando partidos...")
    
    partidos_data = [
        {
            'fecha': date.today() - timedelta(days=7),
            'equipoA': equipos[0].nombre,
            'equipoB': equipos[1].nombre,
            'resultado': '2-1',
            'estado': 'Finalizado',
            'torneo': torneos[0],
            'equipoLocal': equipos[0],
            'equipoVisitante': equipos[1]
        },
        {
            'fecha': date.today() + timedelta(days=3),
            'equipoA': equipos[2].nombre,
            'equipoB': equipos[3].nombre,
            'resultado': 'Pendiente',
            'estado': 'Preparación',
            'torneo': torneos[0],
            'equipoLocal': equipos[2],
            'equipoVisitante': equipos[3]
        },
        {
            'fecha': date.today() - timedelta(days=3),
            'equipoA': equipos[0].nombre,
            'equipoB': equipos[2].nombre,
            'resultado': '1-1',
            'estado': 'Finalizado',
            'torneo': torneos[0],
            'equipoLocal': equipos[0],
            'equipoVisitante': equipos[2]
        },
    ]
    
    partidos = []
    for data in partidos_data:
        partido, created = Partido.objects.get_or_create(
            fecha=data['fecha'],
            idEquipoLocal=data['equipoLocal'],
            idEquipoVisitante=data['equipoVisitante'],
            idTorneo=data['torneo'],
            defaults={
                'equipoA': data['equipoA'],
                'equipoB': data['equipoB'],
                'resultado': data['resultado'],
                'estado': data['estado']
            }
        )
        partidos.append(partido)
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {partido.equipoA} vs {partido.equipoB} - {partido.fecha}")
    
    return partidos


def crear_resultados(partidos, equipos):
    """Crea resultados para partidos finalizados"""
    print("\n📊 Creando resultados...")
    
    resultados_data = [
        {'partido': partidos[0], 'golesLocal': 2, 'golesVisitante': 1, 'ganador': equipos[0]},
        {'partido': partidos[2], 'golesLocal': 1, 'golesVisitante': 1, 'ganador': None},  # Empate
    ]
    
    for data in resultados_data:
        if data['partido'].estado == 'Finalizado':
            resultado, created = Resultado.objects.get_or_create(
                idPartido=data['partido'],
                defaults={
                    'golesLocal': data['golesLocal'],
                    'golesVisitante': data['golesVisitante'],
                    'ganador': data['ganador']
                }
            )
            ganador_texto = data['ganador'].nombre if data['ganador'] else "Empate"
            print(f"  {'✅ Creado' if created else '📝 Existe'}: {data['partido'].equipoA} {data['golesLocal']}-{data['golesVisitante']} {data['partido'].equipoB} | Ganador: {ganador_texto}")


def crear_estadisticas_equipos(equipos):
    """Crea estadísticas para los equipos"""
    print("\n📈 Creando estadísticas de equipos...")
    
    estadisticas_data = [
        {'equipo': equipos[0], 'puntos': 7, 'partidosJugados': 3, 'victorias': 2, 'empates': 1, 'derrotas': 0},
        {'equipo': equipos[1], 'puntos': 3, 'partidosJugados': 2, 'victorias': 1, 'empates': 0, 'derrotas': 1},
        {'equipo': equipos[2], 'puntos': 4, 'partidosJugados': 2, 'victorias': 1, 'empates': 1, 'derrotas': 0},
        {'equipo': equipos[3], 'puntos': 0, 'partidosJugados': 0, 'victorias': 0, 'empates': 0, 'derrotas': 0},
    ]
    
    for data in estadisticas_data:
        estadistica, created = EstadisticaEquipo.objects.get_or_create(
            idEquipo=data['equipo'],
            defaults={
                'puntos': data['puntos'],
                'partidosJugados': data['partidosJugados'],
                'victorias': data['victorias'],
                'empates': data['empates'],
                'derrotas': data['derrotas']
            }
        )
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {estadistica.idEquipo.nombre} - {estadistica.puntos} pts")


def crear_estadisticas_jugadores(jugadores):
    """Crea estadísticas para los jugadores"""
    print("\n📈 Creando estadísticas de jugadores...")
    
    estadisticas_data = [
        {'jugador': jugadores[0], 'goles': 0, 'partidosJugados': 3},
        {'jugador': jugadores[1], 'goles': 1, 'partidosJugados': 3},
        {'jugador': jugadores[2], 'goles': 3, 'partidosJugados': 2},
        {'jugador': jugadores[3], 'goles': 5, 'partidosJugados': 2},
    ]
    
    for data in estadisticas_data:
        estadistica, created = EstadisticaJugador.objects.get_or_create(
            idJugador=data['jugador'],
            defaults={
                'goles': data['goles'],
                'partidosJugados': data['partidosJugados']
            }
        )
        print(f"  {'✅ Creado' if created else '📝 Existe'}: {estadistica.idJugador.nombre} {estadistica.idJugador.apellido} - {estadistica.goles} goles")


def crear_tabla_posiciones(torneos, equipos):
    """Crea tabla de posiciones para los torneos"""
    print("\n📋 Creando tabla de posiciones...")
    
    for torneo in torneos:
        tabla, created = TablaPosiciones.objects.get_or_create(idTorneo=torneo)
        print(f"  {'✅ Creada' if created else '📝 Existe'}: Tabla para {torneo.nombre}")
        
        # Crear posiciones para cada equipo
        posiciones_data = [
            {'equipo': equipos[0], 'pj': 3, 'pg': 2, 'pe': 1, 'pp': 0, 'pts': 7},
            {'equipo': equipos[2], 'pj': 2, 'pg': 1, 'pe': 1, 'pp': 0, 'pts': 4},
            {'equipo': equipos[1], 'pj': 2, 'pg': 1, 'pe': 0, 'pp': 1, 'pts': 3},
            {'equipo': equipos[3], 'pj': 0, 'pg': 0, 'pe': 0, 'pp': 0, 'pts': 0},
        ]
        
        for data in posiciones_data:
            posicion, created = Posicion.objects.get_or_create(
                idTabla=tabla,
                idEquipo=data['equipo'],
                defaults={
                    'pj': data['pj'],
                    'pg': data['pg'],
                    'pe': data['pe'],
                    'pp': data['pp'],
                    'pts': data['pts']
                }
            )
            if created:
                print(f"    ✅ Posición creada: {posicion.idEquipo.nombre} - {posicion.pts} pts")


def main():
    """Función principal que ejecuta todo el proceso"""
    print("\n" + "="*50)
    print("🚀 POBLANDO BASE DE DATOS CON DATOS DE PRUEBA")
    print("="*50)
    
    try:
        # Limpiar base de datos
        limpiar_base_datos()
        
        # Crear datos en orden
        roles = crear_roles()
        usuarios = crear_usuarios(roles)
        equipos = crear_equipos(usuarios)
        jugadores = crear_jugadores(usuarios, equipos)
        torneos = crear_torneos()
        partidos = crear_partidos(equipos, torneos)
        crear_resultados(partidos, equipos)
        crear_estadisticas_equipos(equipos)
        crear_estadisticas_jugadores(jugadores)
        crear_tabla_posiciones(torneos, equipos)
        
        print("\n" + "="*50)
        print("✅ BASE DE DATOS POBLADA EXITOSAMENTE")
        print("="*50)
        print("\n📊 Resumen:")
        print(f"  - {Rol.objects.count()} roles")
        print(f"  - {Usuario.objects.count()} usuarios")
        print(f"  - {Equipo.objects.count()} equipos")
        print(f"  - {Jugador.objects.count()} jugadores")
        print(f"  - {Torneo.objects.count()} torneos")
        print(f"  - {Partido.objects.count()} partidos")
        print(f"  - {Resultado.objects.count()} resultados")
        print(f"  - {EstadisticaEquipo.objects.count()} estadísticas de equipos")
        print(f"  - {EstadisticaJugador.objects.count()} estadísticas de jugadores")
        print(f"  - {TablaPosiciones.objects.count()} tablas de posiciones")
        print(f"  - {Posicion.objects.count()} posiciones")
        
        print("\n🔑 Credenciales de acceso:")
        print("  Admin: admin@ligadevpro.com / admin123")
        print("  Jugadores: jperez@email.com / jugador123")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ Error al poblar la base de datos: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
