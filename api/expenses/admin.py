from django.contrib import admin
from expenses.models import Expense

# Register your models here.
class ExpenseAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'amount'
    ]
    list_filter = ['name', 'amount']
    search_fields = ['name']


admin.site.register(Expense, ExpenseAdmin)