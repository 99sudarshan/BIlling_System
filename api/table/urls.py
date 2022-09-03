from django.urls import path
from .views import *

urlpatterns = [
    path('', TableView.as_view(), name='table'),
    path('delete/<int:id>', delete_table, name='delete_table'),
    path('edit/<int:id>', edit_table, name='edit_table'),
]
