from django.utils import simplejson
from dajaxice.decorators import dajaxice_register
from Principal.models import *
from django.core import serializers
import json


@dajaxice_register
def get_locals(request):
    objetos= Local.objects.all().values_list('nombre','lan','lot')
    data=[]
    for local in objetos:
        data.append(local)


    print data
    #data = serializers.serialize("json", data)
    return json.dumps((data))
