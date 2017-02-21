from django.shortcuts import render
from django.http.response import JsonResponse


def page(request):
    return render(request, "game_page.html")
