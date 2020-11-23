from django.urls import path
from django.urls.conf import re_path

from .api import (
    MyQuizListAPI,
    QuizDetailAPI,
    QuizListAPI,
    SaveUsersAnswer,
    SubmitQuizAPI,
)

urlpatterns = [
    path("my-quizs/", MyQuizListAPI.as_view()),
    path("quizs/", QuizListAPI.as_view()),
    path("save-answer/", SaveUsersAnswer.as_view()),
    re_path(r"quizs/(?P<slug>[\w\-]+)/$", QuizDetailAPI.as_view()),
    re_path(r"quizs/(?P<slug>[\w\-]+)/submit/$", SubmitQuizAPI.as_view()),
]
