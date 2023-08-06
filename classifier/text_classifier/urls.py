from django.urls import include, path
from . import views

app_name = "classifier"

urlpatterns = [
    path('classify', views.TextClassifierView.as_view()),
    path('list', views.TextClassifierListView.as_view()),
] 