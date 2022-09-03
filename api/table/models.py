from django.db import models

# Create your models here.
STATUS = (
    (1,"Free"),
    (0,"Occupied")
)

class Table(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    status = models.IntegerField(choices=STATUS, default=1)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Tables"
