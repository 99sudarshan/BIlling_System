from django import forms


class CategoryForm(forms.Form):
    name = forms.CharField(required=False)
    status = forms.CharField(required=False)
    
class ProductForm(forms.Form):
    image = forms.ImageField(required=False)
    name = forms.CharField(required=False)
    price = forms.FloatField(required=False)
    description = forms.CharField(widget=forms.Textarea(attrs={
        'rows': 3
    }))
    category_id = forms.IntegerField(required=False)
    status = forms.CharField(required=False)
