from django.conf.urls import url, include
import index.views


urlpatterns = [
    url(r'^$', index.views.index, name='index')
]
