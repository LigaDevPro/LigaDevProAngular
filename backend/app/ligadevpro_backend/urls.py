from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Router para las vistas basadas en clases
router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # URLs de la API
    path('api/', include(router.urls)),
    
]
