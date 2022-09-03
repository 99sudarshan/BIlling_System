from django.db import models
from django.utils import timezone
from ckeditor.fields import RichTextField
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
  

# Create your models here.
class CompanyInfo(models.Model):
    CURRENCY = (
        ('NPR', 'NPR'),
        ('INR', 'INR'),
        ('USD', 'USD'),
    )
    logo = models.ImageField(_("Company Logo"), upload_to='img/logo', default='default.png')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    pan_no = models.CharField(max_length=100)
    # message = RichTextField()
    # VAT = models.CharField(max_length=2, help_text='Specify VAT in %', null=True, blank=True)
    Tax = models.CharField(max_length=2, help_text='Specify Tax in %', null=True, blank=True)
    service_charge = models.CharField(max_length=50, null=True, blank=True)   
    currency = models.CharField(max_length=50, choices=CURRENCY)
    fiscal_year = models.CharField(max_length=50)
    ird_username = models.CharField(max_length=50)
    ird_password = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Company Info"

    