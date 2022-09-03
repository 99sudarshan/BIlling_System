from django.contrib import admin
from .models import *

# Register your models here.
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'item',
        'quantity',
        'ordered'
    ]
    list_filter = ['user', 'item', 'ordered']
    search_fields = ['user', 'item']
    exclude = ['total_price']
    
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name',
        # 'items',
        'payment_method',
        'amount'
    ]
    list_filter = ['customer_name', 'payment_method', 'amount']
    search_fields = ['customer_name', 'items']


admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)