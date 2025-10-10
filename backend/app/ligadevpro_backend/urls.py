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
    EquipoView,
    EquipoDetailView,
    PartidoView,
    PartidoDetailView,
    EstadisticaEquipoView,
    EstadisticaJugadorView
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
]