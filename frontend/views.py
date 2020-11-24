from django.shortcuts import redirect, render

from accounts.serializers import LoginSerializer

# Create your views here.


def home(request):
    context = {}
    template_name = "frontend/home.html"
    return render(request, template_name, context)


def login(request):
    # if request.method == "POST":
    # return redirect("/")
    return render(request, "login.html", context={})


def register(request):
    # if request.method == "POST":
    #     return redirect("login")
    return render(request, "register.html")
