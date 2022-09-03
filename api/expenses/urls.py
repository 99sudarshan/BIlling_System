from django.urls import path
from .views import *

urlpatterns = [
    path('', ExpenseView.as_view(), name='expense'),
    path('delete/<int:id>', delete_expense, name='delete_expense'),
    path('edit/<int:id>', edit_expense, name='edit_expense'),
]
