from django.shortcuts import render

# Create your views here.


def home(request):
    context = {}
    template_name = "quiz/home.html"
    return render(request, template_name, context)
