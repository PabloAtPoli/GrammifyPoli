from django.urls import path
from . import views

urlpatterns = [
    path('api/sentences/', views.sentences_list_create, name='sentences_list_create'),
    path('api/sentences/<int:pk>/', views.sentence_detail, name='sentence_detail'),
]
