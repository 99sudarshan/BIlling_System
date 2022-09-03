from django.urls import path
from .views import *

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('company_info', CompanyInfoView.as_view(), name='company_info'),
    path('company_info/delete/<int:id>', delete_company_info, name='delete_company_info'),
    path('company_info/edit/<int:id>', edit_company_info, name='edit_company_info'),
    path('action_log', ActionLogView.as_view(), name='action_log'),
    path('backup', BackupView.as_view(), name='backup'),
    path('profile', ProfileView.as_view(), name='profile'),
]
