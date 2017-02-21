from django.contrib import admin
from .models import IndexModule


@admin.register(IndexModule)
class PersonAdmin(admin.ModelAdmin):
    pass
