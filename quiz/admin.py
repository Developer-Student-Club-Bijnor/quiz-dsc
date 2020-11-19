from django.contrib import admin
import nested_admin
from .models import Quiz, QuizTaker, Response, Question, Answer

# Register your models here.


class AnswerInline(nested_admin.NestedTabularInline):
    model = Answer
    extra = 4
    max_num = 4


class QuestionInline(nested_admin.NestedTabularInline):
    model = Question
    inlines = [
        AnswerInline,
    ]
    extra = 5


class QuizAdmin(nested_admin.NestedModelAdmin):
    inlines = [
        QuestionInline,
    ]


class QuizTakerAdmin(admin.ModelAdmin):
    inlines = []


admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizTaker, QuizTakerAdmin)
admin.site.register(Response)
