from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from proyect.views import (
    UsuarioView,
    UserView,
    LoginView,
    LogoutView,
    UserProfileView,
    UsuarioDetailView,
    CambiarPasswordView,
    EquipoView,
    EquipoDetailView,
    PartidoView,
    PartidoDetailView,
    EstadisticaEquipoView,
    EstadisticaJugadorView,
    RolView,
    RolDetailView,
    TorneoView,
    TorneoDetailView,
    JugadorView,
    JugadorDetailView,
    ResultadoView,
    ResultadoDetailView,
    TablaPosicionesView,
    TablaPosicionesDetailView,
    PosicionView,
    PosicionDetailView
)

# Router para las vistas basadas en clases
router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # URLs de la API
    path('api/', include(router.urls)),
    
    # URLs de usuarios
    path('api/usuarios/', UserView.as_view(), name='usuarios-list-create'),
    path('api/usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
    path('api/usuarios/<int:pk>/cambiar-password/', CambiarPasswordView.as_view(), name='cambiar-password'),
    
    # URLs de autenticación
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # URLs de equipos
    path('api/equipos/', EquipoView.as_view(), name='equipos-list-create'),
    path('api/equipos/<int:pk>/', EquipoDetailView.as_view(), name='equipo-detail'),
    
    # URLs de partidos
    path('api/partidos/', PartidoView.as_view(), name='partidos-list-create'),
    path('api/partidos/<int:pk>/', PartidoDetailView.as_view(), name='partido-detail'),
    
    # URLs de estadísticas
    path('api/estadisticas/equipos/', EstadisticaEquipoView.as_view(), name='estadisticas-equipos'),
    path('api/estadisticas/jugadores/', EstadisticaJugadorView.as_view(), name='estadisticas-jugadores'),
    
    # URLs de roles
    path('api/roles/', RolView.as_view(), name='roles-list-create'),
    path('api/roles/<int:pk>/', RolDetailView.as_view(), name='rol-detail'),
    
    # URLs de torneos
    path('api/torneos/', TorneoView.as_view(), name='torneos-list-create'),
    path('api/torneos/<int:pk>/', TorneoDetailView.as_view(), name='torneo-detail'),
    
    # URLs de jugadores
    path('api/jugadores/', JugadorView.as_view(), name='jugadores-list-create'),
    path('api/jugadores/<int:pk>/', JugadorDetailView.as_view(), name='jugador-detail'),
    
    # URLs de resultados
    path('api/resultados/', ResultadoView.as_view(), name='resultados-list-create'),
    path('api/resultados/<int:pk>/', ResultadoDetailView.as_view(), name='resultado-detail'),
    
    # URLs de tablas de posiciones
    path('api/tablas/', TablaPosicionesView.as_view(), name='tablas-list-create'),
    path('api/tablas/<int:pk>/', TablaPosicionesDetailView.as_view(), name='tabla-detail'),
    
    # URLs de posiciones
    path('api/posiciones/', PosicionView.as_view(), name='posiciones-list-create'),
    path('api/posiciones/<int:pk>/', PosicionDetailView.as_view(), name='posicion-detail'),
]
