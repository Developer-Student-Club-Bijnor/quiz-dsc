from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from accounts.models import User


class UserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ("username",)


class UserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "email")
