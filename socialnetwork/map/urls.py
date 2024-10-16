# map/urls.py
from django.urls import path
from .views import MapIndexView

urlpatterns = [
    path('', MapIndexView.as_view(), name='map_index'),
]
