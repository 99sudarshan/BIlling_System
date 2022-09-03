from django import forms
from django.contrib.auth.models import User, Permission
from django.contrib.auth.forms import UserCreationForm


class UserRegistrationForm(UserCreationForm):
    username = forms.CharField(required=False)
    password1 = forms.PasswordInput()
    password2 = forms.PasswordInput()
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    group = forms.CharField(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )

    # def clean(self):
    #     cleaned_data = super(UserRegistrationForm, self).clean()
    #     password = cleaned_data.get('password')
    #     confirm_password = cleaned_data.get('confirm_password')
    #     if password and confirm_password:
    #         if password != confirm_password:
    #             raise forms.ValidationError('Password mismatch')

    #     return confirm_password


class GroupRegistrationForm(forms.Form):
    name = forms.CharField(required=False)
    permissions = forms.ModelMultipleChoiceField(queryset=Permission.objects.all(), widget=forms.CheckboxSelectMultiple)


class UserUpdateForm(forms.Form):
    username = forms.CharField(required=False)
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    group = forms.CharField(required=False)