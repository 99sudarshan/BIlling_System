from django import forms
from ckeditor.fields import RichTextField


class CompanyInfoForm(forms.Form):
    logo = forms.ImageField(required=False)
    name = forms.CharField(required=False)
    address = forms.CharField(required=False)
    phone = forms.CharField(required=False)
    pan_no = forms.CharField(required=False)
    # message = forms.CharField(widget=forms.Textarea(attrs={
    #     'rows': 3
    # }))
    # vat = forms.CharField(required=False)
    tax = forms.CharField(required=False)
    service_charge = forms.CharField(required=False)
    currency = forms.CharField(required=False)
    fiscal_year = forms.CharField(required=False)
    ird_username = forms.CharField(required=False)
    ird_password = forms.CharField(required=False)


# class CompanyInfoForm(forms.ModelForm):
#     class Meta:
#         # specify model to be used
#         model = CompanyInfo
#         fields = [
#             "logo",
#             "name",
#             "address",
#             "phone",
#             "message",
#             "VAT",
#             "Tax",
#             "service_charge",
#             "currency"
#         ]