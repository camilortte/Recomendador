#encoding:utf-8

from django.db import models
from django.core.validators import MaxValueValidator , MinValueValidator
import datetime 
from django.contrib.auth.models import AbstractBaseUser,  BaseUserManager ,PermissionsMixin
from django.utils import timezone
#from django.contrib.auth.models import User

class MyUserManager(BaseUserManager):
    def create_user(self, nombre,apellido ,email, cedula, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Debe ingresar un Correo')
        if not nombre:
            raise ValueError('Debe ingresar un Nombre')
        if not apellido:
            raise ValueError('Debe ingresar un Apellido')
        if not cedula:
            raise ValueError('Debe ingresar una cedula')

        user = self.model(
            email=MyUserManager.normalize_email(email),
            nombre=nombre,
            apellido=apellido,
            cedula=cedula,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, nombre,apellido ,email, cedula,password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.model(
            email=MyUserManager.normalize_email(email),
            nombre=nombre,
            apellido=apellido,
            cedula=cedula,
        )
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user

class Localidad(models.Model):
    idLocalidad = models.IntegerField(primary_key=True,null=False,unique=True)
    nombre = models.CharField(max_length=100)
    class Meta:
        verbose_name = u'Localidad'
        verbose_name_plural = u'Localidades'
    def __unicode__(self):
        return self.nombre



class Usuario(AbstractBaseUser,PermissionsMixin):
    nombre = models.CharField(max_length=250,null=False,blank=False)
    apellido = models.CharField(max_length=250,null=False,blank=False)
    email = models.EmailField(
        verbose_name='Correo electronico',
        max_length=255,
        unique=True,
        db_index=True,
    )
    cedula = models.CharField(max_length=11,null=True,blank=False)        
    localidad = models.ForeignKey(Localidad,null=True,blank=False)


    
    is_staff = models.BooleanField(u'staff status', default=False,
        help_text=u'Designates whether the user can log into this admin '
                    'site.')
    is_active = models.BooleanField(u'active', default=True,
        help_text=u'Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.')
    date_joined = models.DateTimeField(u'date joined', default=timezone.now)


    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre','apellido','cedula']

    def get_full_name(self):
        # The user is identified by their email address
        return self.nombre+" "+self.apellido

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __unicode__(self):
        return self.email

    class Meta:
        verbose_name = u'Usuario'
        verbose_name_plural = u'Usuarios'
   
class TipoLocal(models.Model):
    tipo=models.CharField(max_length=250, null=False, blank=False)

    def __unicode__(self):
        return self.tipo

    class Meta:
        verbose_name=u'Tipo de local'
        verbose_name_plural=u'Tipo de locales'

class Local(models.Model):
    nombre = models.CharField(unique=True, max_length=250, null=False, blank=False, verbose_name="Nombre",)
    nit = models.CharField(unique=True, max_length=11, null=True, blank=False,verbose_name="Nit")
    direccion = models.CharField(unique=True, max_length=250, null=False, blank=False, verbose_name="Dirección")
    usuario = models.ForeignKey(Usuario, null=False, blank=False,verbose_name="Usuario")
    tipoLocal = models.ForeignKey(TipoLocal, null=False, blank=False,verbose_name="Tipo de Local")
    lan = models.FloatField(unique=True, null=False, blank=False,verbose_name=" Longitud ")
    lot = models.FloatField(unique=True, null=False, blank=False, verbose_name="Latitud")
    descripcion = models.TextField(verbose_name='Descripción',null=True,blank=True)
    class Meta:
        verbose_name = u'Local'
        verbose_name_plural = u'Locales'

    def __unicode__(self):
        return self.nombre


class Sugerencia(models.Model):
    nombre_usuario= models.CharField(max_length=250)
    email = models.EmailField(max_length=75)
    sugerencia = models.TextField()

    class Meta:
        verbose_name = u'Sugerencia'
        verbose_name_plural = u'Sugerencias'

    def __unicode__(self):
        return self.nombre_usuario+" "+self.email


