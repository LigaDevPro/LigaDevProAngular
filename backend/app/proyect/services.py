"""
Capa de servicios
Contiene la lógica de negocio separada de las vistas
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from .models import Usuario, Equipo, Torneo, Partido, Jugador, EstadisticaEquipo, EstadisticaJugador


# Interfaces

class IUsuarioService(ABC):
    """Servicio de usuarios"""
    @abstractmethod
    def crear_usuario(self, username: str, email: str, password: str, rol_id: int) -> Usuario:
        pass
    
    @abstractmethod
    def obtener_usuario_por_email(self, email: str) -> Optional[Usuario]:
        pass
    
    @abstractmethod
    def autenticar_usuario(self, email: str, password: str) -> Optional[Usuario]:
        pass


class IEquipoService(ABC):
    """Servicio de equipos"""
    @abstractmethod
    def obtener_todos_los_equipos(self) -> List[Equipo]:
        pass
    
    @abstractmethod
    def obtener_equipo_por_id(self, id: int) -> Optional[Equipo]:
        pass
    
    @abstractmethod
    def crear_equipo(self, nombre: str, entrenador: str) -> Equipo:
        pass


class IEstadisticaService(ABC):
    """Servicio de estadísticas"""
    @abstractmethod
    def obtener_estadisticas_equipo(self, id_equipo: int) -> Optional[EstadisticaEquipo]:
        pass
    
    @abstractmethod
    def obtener_estadisticas_jugador(self, id_jugador: int) -> Optional[EstadisticaJugador]:
        pass


# Implementaciones

class UsuarioService(IUsuarioService):
    def crear_usuario(self, username: str, email: str, password: str, rol_id: int) -> Usuario:
        usuario = Usuario.objects.create(
            username=username,
            email=email,
            rol_id_id=rol_id
        )
        usuario.set_password(password)
        usuario.save()
        return usuario
    
    def obtener_usuario_por_email(self, email: str) -> Optional[Usuario]:
        try:
            return Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return None
    
    def autenticar_usuario(self, email: str, password: str) -> Optional[Usuario]:
        usuario = self.obtener_usuario_por_email(email)
        if usuario and usuario.check_password(password):
            return usuario
        return None


class EquipoService(IEquipoService):
    def obtener_todos_los_equipos(self) -> List[Equipo]:
        return Equipo.objects.prefetch_related('jugadores').all()
    
    def obtener_equipo_por_id(self, id: int) -> Optional[Equipo]:
        try:
            return Equipo.objects.prefetch_related('jugadores').get(idEquipo=id)
        except Equipo.DoesNotExist:
            return None
    
    def crear_equipo(self, nombre: str, entrenador: str) -> Equipo:
        return Equipo.objects.create(nombre=nombre, entrenador=entrenador)


class EstadisticaService(IEstadisticaService):
    def obtener_estadisticas_equipo(self, id_equipo: int) -> Optional[EstadisticaEquipo]:
        try:
            return EstadisticaEquipo.objects.get(idEquipo=id_equipo)
        except EstadisticaEquipo.DoesNotExist:
            return None
    
    def obtener_estadisticas_jugador(self, id_jugador: int) -> Optional[EstadisticaJugador]:
        try:
            return EstadisticaJugador.objects.get(idJugador=id_jugador)
        except EstadisticaJugador.DoesNotExist:
            return None


# Factory

class ServiceFactory:
    @staticmethod
    def get_usuario_service() -> IUsuarioService:
        return UsuarioService()
    
    @staticmethod
    def get_equipo_service() -> IEquipoService:
        return EquipoService()
    
    @staticmethod
    def get_estadistica_service() -> IEstadisticaService:
        return EstadisticaService()

