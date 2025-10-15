from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import (
    Usuario, Equipo, Partido, EstadisticaEquipo, EstadisticaJugador,
    Torneo, Resultado, Jugador, TablaPosiciones, Posicion, Rol
)
from .serializers import (
    UsuarioSerializer, 
    UsuarioListSerializer,
    LoginSerializer,
    EquipoSerializer,
    PartidoSerializer,
    EstadisticaEquipoSerializer,
    EstadisticaJugadorSerializer,
    TorneoSerializer,
    ResultadoSerializer,
    JugadorSerializer,
    TablaPosicionesSerializer,
    PosicionSerializer,
    RolSerializer
)
from .services import ServiceFactory, IUsuarioService, IEquipoService, IEstadisticaService


class UserView(APIView):
    """
    Vista para listar y crear usuarios
    """
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.usuario_service: IUsuarioService = ServiceFactory.get_usuario_service()
    
    def get(self, request):
        # Aún usa el modelo directamente para listar (puede ser refactorizado)
        usuarios = Usuario.objects.all()
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """
        Crea un nuevo usuario usando el servicio
        """
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        rol_id = request.data.get('rol_id', 2)  # Default: Jugador
        
        if not all([username, email, password]):
            return Response({
                'error': 'Username, email y password son requeridos'
            }, status=400)
        
        try:
            usuario = self.usuario_service.crear_usuario(username, email, password, rol_id)
            return Response(UsuarioListSerializer(usuario).data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)



class LoginView(APIView):
    """
    Vista para el login de usuarios usando email y password
    """
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.usuario_service: IUsuarioService = ServiceFactory.get_usuario_service()
    
    def post(self, request):
        """
        Autentica un usuario con email y password
        """
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }, status=400)
        
        user = self.usuario_service.autenticar_usuario(email, password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Login exitoso',
                'token': token.key,
                'user': UsuarioListSerializer(user).data
            }, status=200)
        
        return Response({
            'success': False,
            'message': 'Credenciales inválidas'
        }, status=400)


class LogoutView(APIView):
    """
    Vista para el logout de usuarios (sin decoradores)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logout exitoso'}, status=200)
        except:
            return Response({'error': 'Error en el logout'}, status=400)


class UserProfileView(APIView):
    """
    Vista para obtener el perfil del usuario autenticado (sin decoradores)
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = UsuarioListSerializer(request.user)
        return Response(serializer.data, status=200)


class UsuarioView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data, status=200)


class UsuarioDetailView(APIView):
    """
    Vista para obtener, actualizar o eliminar un usuario específico
    """
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un usuario por ID"""
        try:
            usuario = Usuario.objects.get(idUsuario=pk)
            serializer = UsuarioListSerializer(usuario)
            return Response(serializer.data, status=200)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un usuario completo"""
        try:
            usuario = Usuario.objects.get(idUsuario=pk)
            serializer = UsuarioSerializer(usuario, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un usuario"""
        try:
            usuario = Usuario.objects.get(idUsuario=pk)
            serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un usuario"""
        try:
            usuario = Usuario.objects.get(idUsuario=pk)
            usuario.delete()
            return Response({'message': 'Usuario eliminado exitosamente'}, status=200)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)


class CambiarPasswordView(APIView):
    """
    Vista para cambiar la contraseña de un usuario
    """
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        """Cambiar contraseña verificando la actual"""
        try:
            usuario = Usuario.objects.get(idUsuario=pk)
            password_actual = request.data.get('password_actual')
            password_nueva = request.data.get('password_nueva')
            
            if not password_actual or not password_nueva:
                return Response({
                    'error': 'Debes proporcionar la contraseña actual y la nueva'
                }, status=400)
            
            # Verifica que la contraseña actual sea correcta
            if not usuario.check_password(password_actual):
                return Response({
                    'error': 'La contraseña actual es incorrecta'
                }, status=400)
            
            # Valida longitud mínima
            if len(password_nueva) < 8:
                return Response({
                    'error': 'La contraseña debe tener al menos 8 caracteres'
                }, status=400)
            
            # Cambia la contraseña
            usuario.set_password(password_nueva)
            usuario.save()
            
            return Response({
                'success': True,
                'message': 'Contraseña actualizada exitosamente'
            }, status=200)
            
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)


# ==================== VISTAS DE EQUIPOS ====================

class EquipoView(APIView):
    """
    Vista para listar y crear equipos
    """
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.equipo_service: IEquipoService = ServiceFactory.get_equipo_service()
    
    def get(self, request):
        equipos = self.equipo_service.obtener_todos_los_equipos()
        serializer = EquipoSerializer(equipos, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        nombre = request.data.get('nombre')
        entrenador = request.data.get('entrenador')
        
        if not all([nombre, entrenador]):
            return Response({
                'error': 'Nombre y entrenador son requeridos'
            }, status=400)
        
        try:
            equipo = self.equipo_service.crear_equipo(nombre, entrenador)
            return Response(EquipoSerializer(equipo).data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class EquipoDetailView(APIView):
    """
    Vista para obtener, actualizar o eliminar un equipo específico
    """
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.equipo_service: IEquipoService = ServiceFactory.get_equipo_service()
    
    def get(self, request, pk):
        equipo = self.equipo_service.obtener_equipo_por_id(pk)
        if equipo:
            serializer = EquipoSerializer(equipo)
            return Response(serializer.data, status=200)
        return Response({'error': 'Equipo no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un equipo completo"""
        try:
            equipo = Equipo.objects.get(idEquipo=pk)
            serializer = EquipoSerializer(equipo, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Equipo.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un equipo"""
        try:
            equipo = Equipo.objects.get(idEquipo=pk)
            serializer = EquipoSerializer(equipo, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Equipo.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un equipo"""
        try:
            equipo = Equipo.objects.get(idEquipo=pk)
            equipo.delete()
            return Response({'message': 'Equipo eliminado exitosamente'}, status=200)
        except Equipo.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=404)


class PartidoView(APIView):
    """Vista para listar y crear partidos"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los partidos"""
        partidos = Partido.objects.all()
        serializer = PartidoSerializer(partidos, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo partido"""
        serializer = PartidoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PartidoDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un partido específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un partido por ID"""
        try:
            partido = Partido.objects.get(idPartido=pk)
            serializer = PartidoSerializer(partido)
            return Response(serializer.data, status=200)
        except Partido.DoesNotExist:
            return Response({'error': 'Partido no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un partido completo"""
        try:
            partido = Partido.objects.get(idPartido=pk)
            serializer = PartidoSerializer(partido, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Partido.DoesNotExist:
            return Response({'error': 'Partido no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un partido"""
        try:
            partido = Partido.objects.get(idPartido=pk)
            serializer = PartidoSerializer(partido, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Partido.DoesNotExist:
            return Response({'error': 'Partido no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un partido"""
        try:
            partido = Partido.objects.get(idPartido=pk)
            partido.delete()
            return Response({'message': 'Partido eliminado exitosamente'}, status=200)
        except Partido.DoesNotExist:
            return Response({'error': 'Partido no encontrado'}, status=404)


# ==================== VISTAS DE ESTADÍSTICAS ====================

class EstadisticaEquipoView(APIView):
    """Vista para listar estadísticas de equipos"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todas las estadísticas de equipos"""
        estadisticas = EstadisticaEquipo.objects.all()
        serializer = EstadisticaEquipoSerializer(estadisticas, many=True)
        return Response(serializer.data, status=200)


class EstadisticaJugadorView(APIView):
    """Vista para listar estadísticas de jugadores"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todas las estadísticas de jugadores"""
        estadisticas = EstadisticaJugador.objects.all()
        serializer = EstadisticaJugadorSerializer(estadisticas, many=True)
        return Response(serializer.data, status=200)


# ==================== VISTAS DE ROLES ====================

class RolView(APIView):
    """Vista para listar y crear roles"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los roles"""
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo rol"""
        serializer = RolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class RolDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un rol específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un rol por ID"""
        try:
            rol = Rol.objects.get(idRol=pk)
            serializer = RolSerializer(rol)
            return Response(serializer.data, status=200)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un rol completo"""
        try:
            rol = Rol.objects.get(idRol=pk)
            serializer = RolSerializer(rol, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un rol"""
        try:
            rol = Rol.objects.get(idRol=pk)
            serializer = RolSerializer(rol, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un rol"""
        try:
            rol = Rol.objects.get(idRol=pk)
            rol.delete()
            return Response({'message': 'Rol eliminado exitosamente'}, status=200)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=404)


# ==================== VISTAS DE TORNEOS ====================

class TorneoView(APIView):
    """Vista para listar y crear torneos"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los torneos"""
        torneos = Torneo.objects.all()
        serializer = TorneoSerializer(torneos, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo torneo"""
        serializer = TorneoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class TorneoDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un torneo específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un torneo por ID"""
        try:
            torneo = Torneo.objects.get(idTorneo=pk)
            serializer = TorneoSerializer(torneo)
            return Response(serializer.data, status=200)
        except Torneo.DoesNotExist:
            return Response({'error': 'Torneo no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un torneo completo"""
        try:
            torneo = Torneo.objects.get(idTorneo=pk)
            serializer = TorneoSerializer(torneo, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Torneo.DoesNotExist:
            return Response({'error': 'Torneo no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un torneo"""
        try:
            torneo = Torneo.objects.get(idTorneo=pk)
            serializer = TorneoSerializer(torneo, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Torneo.DoesNotExist:
            return Response({'error': 'Torneo no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un torneo"""
        try:
            torneo = Torneo.objects.get(idTorneo=pk)
            torneo.delete()
            return Response({'message': 'Torneo eliminado exitosamente'}, status=200)
        except Torneo.DoesNotExist:
            return Response({'error': 'Torneo no encontrado'}, status=404)


# ==================== VISTAS DE JUGADORES ====================

class JugadorView(APIView):
    """Vista para listar y crear jugadores"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los jugadores"""
        jugadores = Jugador.objects.all()
        serializer = JugadorSerializer(jugadores, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo jugador"""
        serializer = JugadorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class JugadorDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un jugador específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un jugador por ID"""
        try:
            jugador = Jugador.objects.get(idJugador=pk)
            serializer = JugadorSerializer(jugador)
            return Response(serializer.data, status=200)
        except Jugador.DoesNotExist:
            return Response({'error': 'Jugador no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un jugador completo"""
        try:
            jugador = Jugador.objects.get(idJugador=pk)
            serializer = JugadorSerializer(jugador, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Jugador.DoesNotExist:
            return Response({'error': 'Jugador no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un jugador"""
        try:
            jugador = Jugador.objects.get(idJugador=pk)
            serializer = JugadorSerializer(jugador, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Jugador.DoesNotExist:
            return Response({'error': 'Jugador no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un jugador"""
        try:
            jugador = Jugador.objects.get(idJugador=pk)
            jugador.delete()
            return Response({'message': 'Jugador eliminado exitosamente'}, status=200)
        except Jugador.DoesNotExist:
            return Response({'error': 'Jugador no encontrado'}, status=404)


# ==================== VISTAS DE RESULTADOS ====================

class ResultadoView(APIView):
    """Vista para listar y crear resultados"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los resultados"""
        resultados = Resultado.objects.all()
        serializer = ResultadoSerializer(resultados, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo resultado"""
        serializer = ResultadoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ResultadoDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un resultado específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un resultado por ID"""
        try:
            resultado = Resultado.objects.get(idResultado=pk)
            serializer = ResultadoSerializer(resultado)
            return Response(serializer.data, status=200)
        except Resultado.DoesNotExist:
            return Response({'error': 'Resultado no encontrado'}, status=404)
    
    def put(self, request, pk):
        """Actualizar un resultado completo"""
        try:
            resultado = Resultado.objects.get(idResultado=pk)
            serializer = ResultadoSerializer(resultado, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Resultado.DoesNotExist:
            return Response({'error': 'Resultado no encontrado'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de un resultado"""
        try:
            resultado = Resultado.objects.get(idResultado=pk)
            serializer = ResultadoSerializer(resultado, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Resultado.DoesNotExist:
            return Response({'error': 'Resultado no encontrado'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar un resultado"""
        try:
            resultado = Resultado.objects.get(idResultado=pk)
            resultado.delete()
            return Response({'message': 'Resultado eliminado exitosamente'}, status=200)
        except Resultado.DoesNotExist:
            return Response({'error': 'Resultado no encontrado'}, status=404)


# ==================== VISTAS DE TABLA DE POSICIONES ====================

class TablaPosicionesView(APIView):
    """Vista para listar y crear tablas de posiciones"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todas las tablas de posiciones"""
        tablas = TablaPosiciones.objects.all()
        serializer = TablaPosicionesSerializer(tablas, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear una nueva tabla de posiciones"""
        serializer = TablaPosicionesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class TablaPosicionesDetailView(APIView):
    """Vista para obtener, actualizar o eliminar una tabla de posiciones específica"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener una tabla de posiciones por ID"""
        try:
            tabla = TablaPosiciones.objects.get(idTabla=pk)
            serializer = TablaPosicionesSerializer(tabla)
            return Response(serializer.data, status=200)
        except TablaPosiciones.DoesNotExist:
            return Response({'error': 'Tabla de posiciones no encontrada'}, status=404)
    
    def put(self, request, pk):
        """Actualizar una tabla de posiciones completa"""
        try:
            tabla = TablaPosiciones.objects.get(idTabla=pk)
            serializer = TablaPosicionesSerializer(tabla, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except TablaPosiciones.DoesNotExist:
            return Response({'error': 'Tabla de posiciones no encontrada'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de una tabla de posiciones"""
        try:
            tabla = TablaPosiciones.objects.get(idTabla=pk)
            serializer = TablaPosicionesSerializer(tabla, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except TablaPosiciones.DoesNotExist:
            return Response({'error': 'Tabla de posiciones no encontrada'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar una tabla de posiciones"""
        try:
            tabla = TablaPosiciones.objects.get(idTabla=pk)
            tabla.delete()
            return Response({'message': 'Tabla de posiciones eliminada exitosamente'}, status=200)
        except TablaPosiciones.DoesNotExist:
            return Response({'error': 'Tabla de posiciones no encontrada'}, status=404)


# ==================== VISTAS DE POSICIONES ====================

class PosicionView(APIView):
    """Vista para listar y crear posiciones"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todas las posiciones"""
        posiciones = Posicion.objects.all()
        serializer = PosicionSerializer(posiciones, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear una nueva posición"""
        serializer = PosicionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PosicionDetailView(APIView):
    """Vista para obtener, actualizar o eliminar una posición específica"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener una posición por ID"""
        try:
            posicion = Posicion.objects.get(idPosicion=pk)
            serializer = PosicionSerializer(posicion)
            return Response(serializer.data, status=200)
        except Posicion.DoesNotExist:
            return Response({'error': 'Posición no encontrada'}, status=404)
    
    def put(self, request, pk):
        """Actualizar una posición completa"""
        try:
            posicion = Posicion.objects.get(idPosicion=pk)
            serializer = PosicionSerializer(posicion, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Posicion.DoesNotExist:
            return Response({'error': 'Posición no encontrada'}, status=404)
    
    def patch(self, request, pk):
        """Actualizar campos específicos de una posición"""
        try:
            posicion = Posicion.objects.get(idPosicion=pk)
            serializer = PosicionSerializer(posicion, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Posicion.DoesNotExist:
            return Response({'error': 'Posición no encontrada'}, status=404)
    
    def delete(self, request, pk):
        """Eliminar una posición"""
        try:
            posicion = Posicion.objects.get(idPosicion=pk)
            posicion.delete()
            return Response({'message': 'Posición eliminada exitosamente'}, status=200)
        except Posicion.DoesNotExist:
            return Response({'error': 'Posición no encontrada'}, status=404)
