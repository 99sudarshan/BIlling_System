from django.contrib import admin
from .models import *

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'status'
    ]
    list_filter = ['name', 'status']
    search_fields = ['name']

class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'image_tag',
        'name',
        'category',
        'price',
        'status'
    ]
    list_filter = ['name', 'status']
    search_fields = ['name']
    exclude = ['slug']
    

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)