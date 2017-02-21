import json

from django.shortcuts import render, render_to_response
from django.http.response import JsonResponse
from django.core import serializers
from .models import IndexModule


def index(request):
    return render(request, "index.html")


def get_index_modules(request):
    im = list(IndexModule.objects.all().values())
    return JsonResponse({'item_list': im})
