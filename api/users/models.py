from django.db import models
from dateutil.relativedelta import relativedelta

# Create your models here.
SUBSCRIPTION_PERIODS = (
    ("day", "Day"),
    ("month", "Month"),
    ("year", "Year")
)


class CompanySubscription(models.Model):
    name = models.CharField(max_length=100)
    subscription_valid_till = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Company Subscriptions"


class CompanySubscriptionTransaction(models.Model):
    company = models.ForeignKey(
        CompanySubscription, on_delete=models.SET_NULL, null=True)
    subscription_period = models.CharField(
        choices=SUBSCRIPTION_PERIODS, default="month", max_length=10)
    subscription_duration = models.IntegerField()
    price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company.name

    def save(self, *args, **kwargs):
        company_subscription = CompanySubscription.objects.get(
            pk=self.company.id)
        if self.subscription_period == "year":
            company_subscription.subscription_valid_till = company_subscription.subscription_valid_till + \
                relativedelta(days=self.subscription_duration)
        elif self.subscription_period == "month":
            company_subscription.subscription_valid_till = company_subscription.subscription_valid_till + \
                relativedelta(months=self.subscription_duration)
        elif self.subscription_period == "day":
            company_subscription.subscription_valid_till = company_subscription.subscription_valid_till + \
                relativedelta(years=self.subscription_duration)
        else:
            pass
        company_subscription.save()
        super(CompanySubscriptionTransaction, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Company Subscription Transaction"


class Devices(models.Model):
    company = models.ForeignKey(
        CompanySubscription, on_delete=models.SET_NULL, null=True)
    device_count = models.IntegerField(default=0)
    device_limit = models.IntegerField(default=1)

    def __str__(self):
        return '%s - %s/%s' % (self.company, self.device_count, self.device_limit)

    class Meta:
        verbose_name_plural = "Devices"


class DevicesHistory(models.Model):
    device = models.ForeignKey(Devices, on_delete=models.SET_NULL, null=True)
    device_ip = models.CharField(max_length=100)
    device_user = models.IntegerField()
    refresh_token = models.TextField()

    def __str__(self):
        return '%s - %s' % (self.device_ip, self.device_user)

    class Meta:
        verbose_name_plural = "Devices History"
