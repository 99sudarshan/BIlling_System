from django.utils import timezone
from django.conf import settings
from django.db import models
from category.models import *
from table.models import *


PAYMENT_TYPES = (
    ('unpaid', 'Unpaid'),
    ('cash', 'Cash'),
    ('credit', 'Credit'),
    ('card', 'Card'),
    ('esewa', 'eSewa')
)

# Create your models here.
class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product = models.CharField(max_length=100, null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    quantity = models.IntegerField(default=1)
    total_price = models.FloatField(default=0)
    note = models.CharField(max_length=200, null=True, blank=True)
    ordered_date = models.DateTimeField(auto_now_add=True)
   

    def get_total_item_price(self):
        return self.quantity * self.item.price
    
    def __str__(self):
        return f" {self.item.name} ({self.quantity})"   

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.item.price
        self.ordered_date = timezone.now()
        super(OrderItem, self).save(*args, **kwargs)   


class Order(models.Model):
    financial_year = models.CharField(max_length=50, null=True, blank=True)
    bill_no = models.CharField(max_length=50, editable=False, unique=True)
    transaction_id = models.CharField(max_length=50, editable=False, unique=True)
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    customer_pan = models.CharField(max_length=100, null=True, blank=True)
    amount = models.FloatField(blank=True, null=True)
    discount = models.FloatField(blank=True, null=True)
    taxable_amount = models.FloatField(blank=True, null=True)
    tax_amount = models.FloatField(blank=True, null=True)
    # vat_amount = models.FloatField(blank=True, null=True)
    service_amount = models.FloatField(blank=True, null=True)
    total_amount = models.FloatField(blank=True, null=True) # net amount
    payment_method = models.CharField(choices=PAYMENT_TYPES, max_length=10, default='unpaid')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True)
    items = models.ManyToManyField(OrderItem)
    ordered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField(auto_now_add=True)
    entered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_realtime = models.BooleanField(default=True)
    vat_refund_amount = models.FloatField(blank=True, null=True)
    
    sales_return = models.BooleanField(default=False)
    sales_return_reason = models.CharField(max_length=500, null=True, blank=True)
    # Print details
    printed_time = models.DateTimeField(blank=True, null=True)
    sync_with_ird = models.BooleanField(default=False)
    is_bill_printed = models.BooleanField(default=False)
    is_bill_active = models.BooleanField(default=False)
    # printed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __unicode__(self):
        return self.bill_no

    def __str__(self):
        return self.bill_no

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_item_price()
        return total

    def save(self, *args, **kwargs):
        self.ordered_date = timezone.now()
        super(Order, self).save(*args, **kwargs)   