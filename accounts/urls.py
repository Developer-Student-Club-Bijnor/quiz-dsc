from django.urls import path

from accounts.api import LoginAPI, RegisterAPI, UserAPI

urlpatterns = [
    path("login/", LoginAPI.as_view()),
    path("register/", RegisterAPI.as_view()),
    path("user/", UserAPI.as_view()),
]
