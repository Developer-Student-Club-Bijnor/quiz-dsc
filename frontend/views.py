from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from accounts.serializers import LoginSerializer

# Create your views here.

# @login_required(login_url='login')
def home(request):
    context = {}
    template_name = "frontend/home.html"
    return render(request, template_name, context)


def login(request):
    serializer = LoginSerializer
    return render(request, "login.html", context={"serializer": serializer})
