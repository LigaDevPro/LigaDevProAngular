from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Usuario, Rol, Equipo, EstadisticaEquipo, Torneo, 
    Partido, Resultado, Jugador, EstadisticaJugador, 
    TablaPosiciones, Posicion
)


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['idRol', 'nombre', 'descripcion']
    search_fields = ['nombre', 'descripcion']


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """
    Configuración del admin para el modelo Usuario personalizado según ERD
    """
    
    # Campos que se muestran en la lista
    list_display = [
        'idUsuario',
        'mail', 
        'username', 
        'nombre',
        'rol_id',
        'is_active',
        'date_joined'
    ]
    
    # Campos por los que se puede filtrar
    list_filter = [
        'rol_id',
        'is_active',
        'is_superuser',
        'date_joined'
    ]
    
    # Campos por los que se puede buscar
    search_fields = [
        'mail',
        'username',
        'nombre'
    ]
    
    # Campos de solo lectura
    readonly_fields = [
        'date_joined',
        'last_login'
    ]
    
    # Ordenamiento por defecto
    ordering = ['-date_joined']
    
    # Campos agrupados en el formulario de edición
    fieldsets = (
        ('Información Básica', {
            'fields': ('username', 'mail', 'password')
        }),
        ('Información Personal', {
            'fields': (
                'nombre',
                'rol_id'
            )
        }),
        ('Permisos', {
            'fields': (
                'is_active',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        ('Fechas', {
            'fields': (
                'last_login',
                'date_joined'
            )
        })
    )
    
    # Campos para crear un nuevo usuario
    add_fieldsets = (
        ('Información Básica', {
            'classes': ('wide',),
            'fields': ('username', 'mail', 'password1', 'password2'),
        }),
        ('Información Personal', {
            'fields': ('nombre', 'rol_id')
        }),
    )


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ['idEquipo', 'nombre', 'entrenador']
    search_fields = ['nombre', 'entrenador']
    filter_horizontal = ['idUsuario']  


@admin.register(EstadisticaEquipo)
class EstadisticaEquipoAdmin(admin.ModelAdmin):
    list_display = ['idEstadisticaEquipo', 'idEquipo', 'puntos', 'partidosJugados', 'victorias', 'empates', 'derrotas']
    list_filter = ['idEquipo']


@admin.register(Torneo)
class TorneoAdmin(admin.ModelAdmin):
    list_display = ['idTorneo', 'nombre', 'descripcion', 'formato', 'fechaInicio', 'fechaFinal', 'estado']
    list_filter = ['formato', 'estado', 'fechaInicio']
    search_fields = ['nombre', 'formato', 'descripcion']


@admin.register(Partido)
class PartidoAdmin(admin.ModelAdmin):
    list_display = ['idPartido', 'fecha', 'equipoA', 'equipoB', 'resultado', 'estado', 'idTorneo']
    list_filter = ['estado', 'fecha', 'idTorneo']
    search_fields = ['equipoA', 'equipoB', 'resultado', 'idTorneo__nombre']


@admin.register(Resultado)
class ResultadoAdmin(admin.ModelAdmin):
    list_display = ['idResultado', 'idPartido', 'golesLocal', 'golesVisitante', 'ganador']
    list_filter = ['ganador']


@admin.register(Jugador)
class JugadorAdmin(admin.ModelAdmin):
    list_display = ['idJugador', 'nombre', 'apellido', 'numeroPosicion', 'posicion', 'idEquipo']
    list_filter = ['posicion', 'numeroPosicion', 'idEquipo']
    search_fields = ['nombre', 'apellido', 'idEquipo__nombre']


@admin.register(EstadisticaJugador)
class EstadisticaJugadorAdmin(admin.ModelAdmin):
    list_display = ['idEstadisticaJugador', 'idJugador', 'goles', 'partidosJugados']
    list_filter = ['idJugador']


@admin.register(TablaPosiciones)
class TablaPosicionesAdmin(admin.ModelAdmin):
    list_display = ['idTabla', 'idTorneo']
    search_fields = ['idTorneo__nombre']


@admin.register(Posicion)
class PosicionAdmin(admin.ModelAdmin):
    list_display = ['idPosicion', 'idTabla', 'idEquipo', 'pts', 'pj', 'pg', 'pe', 'pp']
    list_filter = ['idTabla', 'idEquipo']
    search_fields = ['idEquipo__nombre', 'idTabla__idTorneo__nombre']