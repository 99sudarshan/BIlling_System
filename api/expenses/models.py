from django.db import models

# Create your models here.
class Expense(models.Model):
    name = models.CharField(max_length=100)
    amount = models.FloatField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Expenses"
        