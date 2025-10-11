from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    Usuario, Rol, Equipo, EstadisticaEquipo, Torneo, 
    Partido, Resultado, Jugador, EstadisticaJugador, 
    TablaPosiciones, Posicion
)


class RolSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Rol
    """
    class Meta:
        model = Rol
        fields = "__all__"


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Usuario según ERD
    """
    password = serializers.CharField(write_only=True, min_length=8)
    rol_nombre = serializers.CharField(source='rol_id.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = "__all__"
        read_only_fields = ['idUsuario', 'date_joined']
    
    def create(self, validated_data):
        """
        Crea un nuevo usuario con contraseña encriptada
        """
        password = validated_data.pop('password')
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario
    
    def update(self, instance, validated_data):
        """
        Actualiza un usuario existente
        """
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        return super().update(instance, validated_data)


class UsuarioListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar usuarios (sin datos sensibles)
    """
    rol_nombre = serializers.CharField(source='rol_id.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'idUsuario',
            'username',
            'mail',
            'nombre',
            'rol_id',
            'rol_nombre',
            'is_active',
            'date_joined'
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer para el login de usuarios
    """
    mail = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """
        Valida las credenciales del usuario
        """
        mail = attrs.get('mail')
        password = attrs.get('password')
        
        if mail and password:
            # Buscar usuario por mail
            try:
                usuario = Usuario.objects.get(mail=mail)
                
                # Verificar si la contraseña es correcta
                if usuario.check_password(password):
                    if not usuario.is_active:
                        raise serializers.ValidationError('Usuario inactivo.')
                    
                    attrs['user'] = usuario
                    return attrs
                else:
                    raise serializers.ValidationError('Credenciales inválidas.')
                
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Usuario no encontrado.')
        else:
            raise serializers.ValidationError('Debe incluir mail y contraseña.')


class JugadorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Jugador
    """
    usuario = UsuarioListSerializer(source='idUsuario', read_only=True)
    
    class Meta:
        model = Jugador
        fields = '__all__'


class EquipoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Equipo
    """
    jugadores = JugadorSerializer(many=True, read_only=True)
    usuarios = UsuarioListSerializer(source='idUsuario', many=True, read_only=True)
    
    class Meta:
        model = Equipo
        fields = '__all__'


class PartidoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Partido
    """
    equipo_local = serializers.CharField(source='idEquipoLocal.nombre', read_only=True)
    equipo_visitante = serializers.CharField(source='idEquipoVisitante.nombre', read_only=True)
    torneo = serializers.CharField(source='idTorneo.nombre', read_only=True)
    
    class Meta:
        model = Partido
        fields = '__all__'


class EstadisticaEquipoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo EstadisticaEquipo
    """
    equipo_nombre = serializers.CharField(source='idEquipo.nombre', read_only=True)
    
    class Meta:
        model = EstadisticaEquipo
        fields = '__all__'


class EstadisticaJugadorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo EstadisticaJugador
    """
    jugador_nombre = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = EstadisticaJugador
        fields = '__all__'
    
    def get_jugador_nombre(self, obj):
        """ Retorna el nombre completo del jugador """
        return f"{obj.idJugador.nombre} {obj.idJugador.apellido}"
    
    
    

