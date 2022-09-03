from django.contrib import admin
from users.models import CompanySubscription, CompanySubscriptionTransaction, Devices, DevicesHistory

# Register your models here.


class CompanySubscriptionModel(admin.ModelAdmin):
    list_display = [
        'name',
        'subscription_valid_till'
    ]
    list_filter = ['name', 'subscription_valid_till']
    search_fields = ['name']


admin.site.register(CompanySubscription, CompanySubscriptionModel)


class CompanySubscriptionTransactionModel(admin.ModelAdmin):
    list_display = [
        'company',
        'subscription_duration',
        'subscription_period',
        'created_at'
    ]
    list_filter = ['company', 'subscription_period',
                   'subscription_duration', 'created_at']
    search_fields = ['company']


admin.site.register(CompanySubscriptionTransaction,
                    CompanySubscriptionTransactionModel)


class DeviceModel(admin.ModelAdmin):
    list_display = [
        'company',
        'device_count',
        'device_limit'
    ]
    list_filter = ['company', 'device_count', 'device_limit']
    search_fields = ['company']


admin.site.register(Devices, DeviceModel)


class DevicesHistoryModel(admin.ModelAdmin):
    list_display = [
        'device_ip',
        'device_user'
    ]
    list_filter = ['device_ip', 'device_user']
    search_fields = ['device_ip', 'device_user']


admin.site.register(DevicesHistory, DevicesHistoryModel)
