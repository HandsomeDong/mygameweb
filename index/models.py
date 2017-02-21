from django.db import models


class IndexModule(models.Model):
    name = models.CharField(max_length=50, default='')
    link = models.CharField(max_length=200, default='')
