from django import forms

class TableForm(forms.Form):
    name = forms.CharField(required=False)
    capacity = forms.IntegerField(required=False)
    status = forms.IntegerField(required=False)
