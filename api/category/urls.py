from django.urls import path
from .views import *

urlpatterns = [
    path('category', CategoryView.as_view(), name='category'),
    path('category/delete/<int:id>', delete_category, name='delete_category'),
    path('category/edit/<int:id>', edit_category, name='edit_category'),
    path('product', ProductView.as_view(), name='product'),
    path('product/delete/<int:id>', delete_product, name='delete_product'),
    path('product/edit/<int:id>', edit_product, name='edit_product'),
]
