from unicodedata import name

from django.urls import path

from frontend import views

urlpatterns = [
    path("", views.home),
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
]
