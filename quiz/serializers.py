from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Answer, Question, Quiz, QuizTaker, UsersAnswer


class UsersAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersAnswer
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "question", "label"]


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = "__all__"


class QuizTakerSerializer(serializers.ModelSerializer):
    users_answer_set = UsersAnswerSerializer(many=True)

    class Meta:
        model = QuizTaker
        fields = "__all__"


class QuizListSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "name", "description", "image", "slug", "questions_count"]
        read_only_field = ["questions_count"]

    def get_questions_count(self, obj):
        return obj.question_set.all().count()


class QuizDetailSerializer(serializers.ModelSerializer):
    quiztakers_set = serializers.SerializerMethodField()
    questions_set = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = "__all__"

    def get_quiztakers_set(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            serializer = QuizTakerSerializer(quiz_taker)
        except QuizTaker.DoesNotExist:
            return None
