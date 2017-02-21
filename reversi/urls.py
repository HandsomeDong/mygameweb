from django.conf.urls import url, include
import reversi.views


urlpatterns = [
    url(r'^$', reversi.views.page, name='page'),
]
