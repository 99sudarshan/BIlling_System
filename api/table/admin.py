from django.contrib import admin
from .models import *

# Register your models here.
class TableAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'capacity',
        'status'
    ]
    list_filter = ['name', 'status']
    search_fields = ['name']


admin.site.register(Table, TableAdmin)
