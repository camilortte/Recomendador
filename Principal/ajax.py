from django.utils import simplejson
from dajaxice.decorators import dajaxice_register
from Principal.models import *
from django.core import serializers
import json


@dajaxice_register
def get_locals(request):
    objetos= Local.objects.all().values_list('nombre', 'lan', 'lot', 'descripcion', 'direccion', 'tipoLocal')
    data=[]
    for local in objetos:
        data.append(local)
    return json.dumps(data)

@dajaxice_register
def get_locals_filter(request, tipoLocal):
    if tipoLocal=='Todos':
        objetos= Local.objects.all().values_list('nombre', 'lan', 'lot', 'descripcion', 'direccion', 'tipoLocal')
    else:
        objetos=Local.objects.filter(tipoLocal=tipoLocal).values_list('nombre', 'lan', 'lot', 'descripcion', 'direccion', 'tipoLocal')

    data = []
    for local in objetos:
        data.append(local)
    return json.dumps(data)