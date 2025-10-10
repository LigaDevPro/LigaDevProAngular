from django.db import models
from django.contrib.auth.models import AbstractUser


class Rol(models.Model):
    """
    Modelo para los roles de usuario
    """
    idRol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, help_text="Nombre del rol")
    descripcion = models.CharField(max_length=255, help_text="Descripción del rol")
    
    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    """
    Modelo de Usuario
    """
    idUsuario = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, default='Usuario', help_text="Nombre del usuario")
    email = models.EmailField(unique=True, default='usuario@example.com', help_text="Correo electrónico")
    password = models.CharField(max_length=255, default='password123', help_text="Contraseña")
    rol_id = models.ForeignKey(Rol, on_delete=models.CASCADE, null=True, blank=True, help_text="Rol del usuario")
    
    # Configuración del modelo
    USERNAME_FIELD = 'mail'
    REQUIRED_FIELDS = ['username', 'nombre']
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.nombre} ({self.mail})"


class Equipo(models.Model):
    """
    Modelo para los equipos
    """
    idEquipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, help_text="Nombre del equipo")
    entrenador = models.CharField(max_length=100, default='Sin entrenador', help_text="Entrenador del equipo")
    idUsuario = models.ManyToManyField(Usuario, related_name='equipos_relacionados', blank=True, help_text="Usuarios del equipo")
    
    class Meta:
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class EstadisticaEquipo(models.Model):
    """
    Modelo para las estadísticas de los equipos
    """
    idEstadisticaEquipo = models.AutoField(primary_key=True)
    idEquipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, help_text="Equipo")
    puntos = models.IntegerField(default=0, help_text="Puntos totales")
    partidosJugados = models.IntegerField(default=0, help_text="Partidos jugados")
    victorias = models.IntegerField(default=0, help_text="Victorias")
    empates = models.IntegerField(default=0, help_text="Empates")
    derrotas = models.IntegerField(default=0, help_text="Derrotas")
    
    class Meta:
        verbose_name = "Estadística de Equipo"
        verbose_name_plural = "Estadísticas de Equipos"
        ordering = ['-puntos']
    
    def __str__(self):
        return f"Estadísticas de {self.idEquipo.nombre}"


class Torneo(models.Model):
    """
    Modelo para los torneos
    """
    ESTADO_CHOICES = [
        ('Preparación', 'Preparación'),
        ('En curso', 'En curso'),
        ('Finalizado', 'Finalizado'),
        ('Cancelado', 'Cancelado'),
    ]

    
    idTorneo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, help_text="Nombre del torneo")
    descripcion = models.TextField(default='Sin descripción', help_text="Descripción del torneo")
    formato = models.CharField(max_length=50, help_text="Formato del torneo (liga, eliminatoria, etc.)")
    fechaInicio = models.DateField(default='2024-01-01', help_text="Fecha de inicio del torneo")
    fechaFinal = models.DateField(default='2024-12-31', help_text="Fecha final del torneo")
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='Preparación', help_text="Estado del torneo")
    
    class Meta:
        verbose_name = "Torneo"
        verbose_name_plural = "Torneos"
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class Partido(models.Model):
    """
    Modelo para los partidos
    """
    ESTADO_CHOICES = [
        ('Preparación', 'Preparación'),
        ('En curso', 'En curso'),
        ('Finalizado', 'Finalizado'),
        ('Cancelado', 'Cancelado'),
    ]
    
    idPartido = models.AutoField(primary_key=True)
    fecha = models.DateField(help_text="Fecha del partido")
    equipoA = models.CharField(max_length=100, default='Equipo A', help_text="Nombre del equipo A")
    equipoB = models.CharField(max_length=100, default='Equipo B', help_text="Nombre del equipo B")
    resultado = models.CharField(max_length=20, default='Pendiente', help_text="Resultado del partido")
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='Preparación', help_text="Estado del partido")
    idTorneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, help_text="Torneo al que pertenece")
    idEquipoLocal = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_local', help_text="Equipo local")
    idEquipoVisitante = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_visitante', help_text="Equipo visitante")
    
    class Meta:
        verbose_name = "Partido"
        verbose_name_plural = "Partidos"
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.idEquipoLocal} vs {self.idEquipoVisitante} - {self.fecha}"


class Resultado(models.Model):
    """
    Modelo para los resultados de los partidos
    """
    idResultado = models.AutoField(primary_key=True)
    idPartido = models.OneToOneField(Partido, on_delete=models.CASCADE, related_name='resultado_partido', help_text="Partido")
    golesLocal = models.IntegerField(default=0, help_text="Goles del equipo local")
    golesVisitante = models.IntegerField(default=0, help_text="Goles del equipo visitante")
    ganador = models.ForeignKey(Equipo, on_delete=models.CASCADE, null=True, blank=True, help_text="Equipo ganador (null si empate)")
    
    class Meta:
        verbose_name = "Resultado"
        verbose_name_plural = "Resultados"
    
    def __str__(self):
        return f"{self.idPartido.idEquipoLocal} {self.golesLocal}-{self.golesVisitante} {self.idPartido.idEquipoVisitante}"


class Jugador(models.Model):
    """
    Modelo para los jugadores
    """
    POSICION_CHOICES = [
        ('arquero', 'Arquero'),
        ('defensor', 'Defensor'),
        ('mediocampo', 'Mediocampo'),
        ('delantero', 'Delantero'),
    ]
    
    idJugador = models.AutoField(primary_key=True)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='jugador', help_text="Usuario asociado al jugador")
    nombre = models.CharField(max_length=100, help_text="Nombre del jugador")
    apellido = models.CharField(max_length=150, default='', help_text="Apellido del jugador")
    numeroPosicion = models.IntegerField(default=0, help_text="Número de posición del jugador")
    posicion = models.CharField(max_length=50, choices=POSICION_CHOICES, help_text="Posición del jugador")
    idEquipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='jugadores', help_text="Equipo al que pertenece")
    
    class Meta:
        verbose_name = "Jugador"
        verbose_name_plural = "Jugadores"
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.idEquipo.nombre})"


class EstadisticaJugador(models.Model):
    """
    Modelo para las estadísticas de los jugadores
    """
    idEstadisticaJugador = models.AutoField(primary_key=True)
    idJugador = models.ForeignKey(Jugador, on_delete=models.CASCADE, help_text="Jugador")
    goles = models.IntegerField(default=0, help_text="Goles marcados")
    partidosJugados = models.IntegerField(default=0, help_text="Partidos jugados")
    
    class Meta:
        verbose_name = "Estadística de Jugador"
        verbose_name_plural = "Estadísticas de Jugadores"
        ordering = ['-goles']
    
    def __str__(self):
        return f"Estadísticas de {self.idJugador.nombre}"


class TablaPosiciones(models.Model):
    """
    Modelo para las tablas de posiciones
    """
    idTabla = models.AutoField(primary_key=True)
    idTorneo = models.OneToOneField(Torneo, on_delete=models.CASCADE, help_text="Torneo")
    
    class Meta:
        verbose_name = "Tabla de Posiciones"
        verbose_name_plural = "Tablas de Posiciones"
    
    def __str__(self):
        return f"Tabla de {self.idTorneo.nombre}"


class Posicion(models.Model):
    """
    Modelo para las posiciones en la tabla
    """
    idPosicion = models.AutoField(primary_key=True)
    idTabla = models.ForeignKey(TablaPosiciones, on_delete=models.CASCADE, help_text="Tabla de posiciones")
    idEquipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, help_text="Equipo")
    pj = models.IntegerField(default=0, help_text="Partidos Jugados")
    pg = models.IntegerField(default=0, help_text="Partidos Ganados")
    pe = models.IntegerField(default=0, help_text="Partidos Empatados")
    pp = models.IntegerField(default=0, help_text="Partidos Perdidos")
    pts = models.IntegerField(default=0, help_text="Puntos")
    
    class Meta:
        verbose_name = "Posición"
        verbose_name_plural = "Posiciones"
        ordering = ['-pts', '-pg', '-pe']
        unique_together = ['idTabla', 'idEquipo']
    
    def __str__(self):
        return f"{self.idEquipo.nombre} en {self.idTabla.idTorneo.nombre}"
