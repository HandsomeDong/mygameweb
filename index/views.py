from django.shortcuts import render, render_to_response
from django.http.response import JsonResponse


def index(request):
    return render(request, "index.html")
