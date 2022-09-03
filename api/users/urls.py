from django.urls import path
from .views import *

urlpatterns = [
    path('users/', UsersView.as_view(), name='users'),
    path('user/delete/<int:id>', delete_user, name='delete_user'),
    path('user/edit/<int:id>', edit_user, name='edit_user'),
    path('groups/', GroupView.as_view(), name='groups'),
    path('group/delete/<int:id>', delete_group, name='delete_groups'),
    path('group/edit/<int:id>', edit_group, name='edit_groups'),
]
