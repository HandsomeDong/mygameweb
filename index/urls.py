from django.conf.urls import url, include
import index.views


urlpatterns = [
    url(r'^$', index.views.index, name='index'),
    url(r'^get_index_modules/$', index.views.get_index_modules, name='get_index_modules')
]
