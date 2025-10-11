from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Usuario, Equipo, Partido, EstadisticaEquipo, EstadisticaJugador
from .serializers import (
    UsuarioSerializer, 
    UsuarioListSerializer,
    LoginSerializer,
    EquipoSerializer,
    PartidoSerializer,
    EstadisticaEquipoSerializer,
    EstadisticaJugadorSerializer
)


class UserView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



class LoginView(APIView):
    """
    Vista para el login de usuarios usando email y password
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Autentica un usuario con email y password
        """
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Crear o obtener token para el usuario
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Login exitoso',
                'token': token.key,
                'user': UsuarioListSerializer(user).data
            }, status=200)
        
        return Response({
            'success': False,
            'message': 'Error en las credenciales',
            'errors': serializer.errors
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


# ==================== VISTAS DE EQUIPOS ====================

class EquipoView(APIView):
    """Vista para listar y crear equipos"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar todos los equipos"""
        equipos = Equipo.objects.all()
        serializer = EquipoSerializer(equipos, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        """Crear un nuevo equipo"""
        serializer = EquipoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class EquipoDetailView(APIView):
    """Vista para obtener, actualizar o eliminar un equipo específico"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Obtener un equipo por ID"""
        try:
            equipo = Equipo.objects.get(idEquipo=pk)
            serializer = EquipoSerializer(equipo)
            return Response(serializer.data, status=200)
        except Equipo.DoesNotExist:
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

