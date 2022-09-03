from django import forms


class ExpenseForm(forms.Form):
    name = forms.CharField(required=False)
    amount = forms.FloatField(required=False)

