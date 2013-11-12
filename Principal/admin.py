from django.contrib import admin
from Principal.models import *
from django.contrib.auth.admin import UserAdmin
#from django.contrib.auth.models import User

#################################
from Principal.forms import UserChangeForm , UserCreationForm

class MyUserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email','nombre','apellido','cedula','is_active', 'is_staff','is_superuser','last_login',)
    list_filter = ('is_staff','last_login')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('nombre','apellido','cedula','localidad')}),
        ('Permissions', {'fields': ('is_staff','is_active','is_superuser','groups',
                                'user_permissions')}),
        ('Important dates', {'fields': ('date_joined','last_login',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'password1', 'password2')}
        ),
    )
    search_fields = ('email','nombre','apellido','cedula',)
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)



admin.site.register(Usuario, MyUserAdmin)
#admin.site.unregister(Group)
#admin.site.unregister(User)
#admin.site.register(User, UserAdmin)
admin.site.register(Localidad)
admin.site.register(Local)
admin.site.register(TipoLocal)
admin.site.register(Sugerencia)
