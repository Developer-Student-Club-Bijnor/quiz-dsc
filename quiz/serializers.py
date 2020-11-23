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
        fields = ["id", "question", "text"]


class MyQuizListSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            "id",
            "name",
            "description",
            "image",
            "slug",
            "questions_count",
            "completed",
            "score",
            "progress",
        ]
        read_only_field = ["questions_count", "completed", "score", "progress"]

    def get_questions_count(self, obj):
        return obj.question_set.all().count()

    def get_completed(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            return quiz_taker.completed
        except QuizTaker.DoesNotExist:
            return None

    def get_progress(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            if quiz_taker.completed is False:
                return int(
                    UsersAnswer.objects.filter(
                        quiztaker=quiz_taker, answer__isnull=False
                    ).count()
                    / obj.question_set.all().count()
                )
            return 100
        except QuizTaker.DoesNotExist:
            return None

    def get_score(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            if quiz_taker.completed is True:
                return quiz_taker.score
            return 0
        except QuizTaker.DoesNotExist:
            return None


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = "__all__"


class QuizTakerSerializer(serializers.ModelSerializer):
    usersanswer_set = UsersAnswerSerializer(many=True)

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
    question_set = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = "__all__"

    def get_quiztakers_set(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            serializer = QuizTakerSerializer(quiz_taker)
            return serializer.data
        except QuizTaker.DoesNotExist:
            return None


class QuizResultSerializer(serializers.ModelSerializer):
    quiztaker_set = serializers.SerializerMethodField()
    question_set = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = "__all__"

    def get_quiztaker_set(self, obj):
        try:
            quiztaker = QuizTaker.objects.get(
                user=self.context["request"].user, quiz=obj
            )
            serializer = QuizTakerSerializer
            return serializer.data
        except QuizTaker.DoesNotExist:
            return None
