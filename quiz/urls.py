from django.urls import path
from django.urls.conf import re_path

from . import views
from .api import QuizDetailAPI, QuizListAPI

urlpatterns = [
    path("", views.home),
    path("quizs/", QuizListAPI.as_view()),
    re_path(r"quizs/(?P<slug>[\w\-]+)/$", QuizDetailAPI.as_view()),
]
