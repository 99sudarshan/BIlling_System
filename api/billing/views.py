from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from django.utils import timezone
import json
from category.serializers import CategorySerializer, ProductSerializer

from companyinfo.serializers import CompanyInfoSerializer
from table.serializers import TableSerializer
from .models import *
from category.models import *
from table.models import *
from companyinfo.models import *
from django.db.models import Q
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from datetime import datetime
from datetime import date
import requests
import nepali_datetime
from django.db.models import Sum, Func
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import OrderItemSerializer, OrderSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


# Create your views here.
class Month(Func):
    function = 'EXTRACT'
    template = '%(function)s(MONTH from %(expressions)s)'
    output_field = models.IntegerField()


class ReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            all_orders = OrderSerializer(Order.objects.filter(Q(payment_method='cash') | Q(payment_method='credit') | Q(payment_method='card') | Q(
                payment_method='esewa')).exclude(sales_return=True, is_realtime=False).order_by('-ordered_date'), many=True).data
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)

            all_orders_new = []
            for order in all_orders:
                all_items = []
                for item in order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=order['table']).first()).data
                order['items'] = all_items
                order['table'] = table
                all_orders_new.append(order)

            context = {
                'title': 'report',
                'all_orders': all_orders_new,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def get_order_report(request, id):
    try:
        order = Order.objects.filter(pk=id)
        view_order = OrderSerializer(order.first()).data
        order_items = OrderItemSerializer(
            Order.objects.get(pk=id).items.all(), many=True).data
        products = Product.objects.filter(status=1)
        all_products = ProductSerializer(products, many=True).data

        all_items = []
        for item in view_order['items']:
            my_item = OrderItemSerializer(
                OrderItem.objects.filter(pk=item).first()).data
            all_items.append(my_item)
        table = TableSerializer(
            Table.objects.filter(pk=view_order['table']).first()).data
        view_order['items'] = all_items
        view_order['table'] = table

        all_products_new = []
        for product in all_products:
            o_item_ids = [a_dict["item"] for a_dict in order_items]
            if product["id"] in o_item_ids:
                product["quantity"] = Order.objects.get(
                    pk=id).items.get(item_id=product["id"]).quantity
            else:
                product["quantity"] = 0
            all_products_new.append(product)

        user = order[0].entered_by
        return JsonResponse({'message': 'Success', 'order': view_order, 'order_items': order_items, 'all_products': all_products_new, 'user': str(user)})
    except Exception as e:
        print(e)
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def update_payment(request, id):
    try:
        order = Order.objects.get(pk=id)
        if order.payment_method == "credit":
            order.payment_method = request.data['selected_payment']
            order.save()

            ct = ContentType.objects.get_for_model(Order)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=order.pk, object_repr=order.bill_no, action_flag=CHANGE, change_message="")

            return Response({"message": "Payment method updated successfully."}, status=status.HTTP_200_OK)
        return Response({"message": "Cannot update non credit payment method."}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BillingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            order_item = OrderItem.objects.filter(
                user=self.request.user, ordered=False)
            categories = Category.objects.filter(status=1)
            if categories.count():
                products = ProductSerializer(Product.objects.filter(
                    category=categories[0]).filter(status=1), many=True).data
            else:
                products = ProductSerializer(
                    Product.objects.filter(status=1), many=True).data
            tables = TableSerializer(Table.objects.filter(status=1), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            total_price = 0
            for o_item in order_item:
                total_price += o_item.item.price*o_item.quantity
            order_item = OrderItemSerializer(order_item, many=True).data
            all_products = []
            for product in products:
                o_item_ids = [a_dict["item"] for a_dict in order_item]
                if product["id"] in o_item_ids:
                    product["quantity"] = OrderItem.objects.filter(
                        user=self.request.user, ordered=False, item=product["id"]).first().quantity
                else:
                    product["quantity"] = 0
                all_products.append(product)

            context = {
                'title': 'Billing',
                'company_info': company_info.data,
                'order_item': order_item,
                'categories': CategorySerializer(categories, many=True).data,
                'products': all_products,
                'total_price': total_price,
                'tables': tables.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def get_product_by_category(request, id):
    try:
        products = Product.objects.filter(category=id)
        all_products = ProductSerializer(products, many=True).data
        order_item = OrderItem.objects.filter(user=request.user, ordered=False)
        order_items = OrderItemSerializer(order_item, many=True).data

        all_products_new = []
        for product in all_products:
            o_item_ids = [a_dict["item"] for a_dict in order_items]
            if product["id"] in o_item_ids:
                product["quantity"] = OrderItem.objects.filter(
                    user=request.user, ordered=False, item=product["id"]).first().quantity
            else:
                product["quantity"] = 0
            all_products_new.append(product)

        return JsonResponse({'message': 'Success', 'products': all_products_new, 'order_item': order_items})
    except Exception as e:
        print(e)
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def add_item_to_order_item(request, slug):
    try:
        item = get_object_or_404(Product, slug=slug)
        # check if the order item is in the order
        if OrderItem.objects.filter(item__slug=item.slug, user=request.user, ordered=False).exists():
            order_item = OrderItem.objects.filter(
                user=request.user,
                item=item,
                ordered=False
            )[0]
            order_item.quantity += 1
            order_item.save()

            my_items = OrderItem.objects.filter(
                ordered=False, user=request.user)
            order_items = OrderItemSerializer(my_items, many=True).data
            products = Product.objects.all()
            all_products = ProductSerializer(products, many=True).data

            all_products_new = []
            for product in all_products:
                o_item_ids = [a_dict["item"] for a_dict in order_items]
                if product["id"] in o_item_ids:
                    product["quantity"] = OrderItem.objects.filter(
                        user=request.user, ordered=False, item=product["id"]).first().quantity
                else:
                    product["quantity"] = 0
                all_products_new.append(product)

            return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products})
        else:
            order_item, created = OrderItem.objects.get_or_create(
                user=request.user,
                item=item,
                product=item.name,
                price=item.price,
                ordered=False
            )

            my_items = OrderItem.objects.filter(
                ordered=False, user=request.user)
            order_items = OrderItemSerializer(my_items, many=True).data
            products = Product.objects.all()
            all_products = ProductSerializer(products, many=True).data

            all_products_new = []
            for product in all_products:
                o_item_ids = [a_dict["item"] for a_dict in order_items]
                if product["id"] in o_item_ids:
                    product["quantity"] = OrderItem.objects.filter(
                        user=request.user, ordered=False, item=product["id"]).first().quantity
                else:
                    product["quantity"] = 0
                all_products_new.append(product)

            return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products})
    except:
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def remove_item_from_order_item(request, slug):
    try:
        item = get_object_or_404(Product, slug=slug)
        # check if the order item is in the order
        if OrderItem.objects.filter(item__slug=item.slug, user=request.user, ordered=False).exists():
            order_item = OrderItem.objects.filter(
                user=request.user,
                item=item,
                ordered=False
            )[0]
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order_item.delete()

            my_items = OrderItem.objects.filter(
                ordered=False, user=request.user)
            order_items = OrderItemSerializer(my_items, many=True).data
            products = Product.objects.all()
            all_products = ProductSerializer(products, many=True).data

            all_products_new = []
            for product in all_products:
                o_item_ids = [a_dict["item"] for a_dict in order_items]
                if product["id"] in o_item_ids:
                    product["quantity"] = OrderItem.objects.filter(
                        user=request.user, ordered=False, item=product["id"]).first().quantity
                else:
                    product["quantity"] = 0
                all_products_new.append(product)

            return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products})
        else:
            return Response({"message": "This item was not in order list"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def save_order_items(request):
    if OrderItem.objects.filter(user=request.user, ordered=False).exists():
        try:
            with transaction.atomic():
                # open an atomic transaction, i.e. all successful or none
                save_order_db(request)
                make_api_call(request)
        except Exception as e:
            print(e)
            return Response({"message": "Error while saving order items"}, status=status.HTTP_400_BAD_REQUEST)

        # messages.success(request, "Order item saved successfully")
        return Response({"message": "Order item saved successfully"}, status=status.HTTP_200_OK)
    else:
        # messages.success(request, "There is no item in order item")
        return Response({"message": "There is no item in order list"}, status=status.HTTP_404_NOT_FOUND)


def save_order_db(request):
    order_items = OrderItem.objects.filter(
        user=request.user,
        ordered=False
    )
    order = Order()
    order.entered_by = request.user
    order.ordered = True
    order.ordered_date = timezone.now()
    order.bill_no = request.data['timestamp']
    order.transaction_id = request.data['timestamp']
    order.table_id = request.data['table']
    order.customer_name = request.data['customer_name']
    order.customer_pan = request.data['customer_pan']
    order.financial_year = request.data['financial_year']
    # if request.POST['is_realtime'] == "yes":
    order.is_realtime = 1
    # else:
    # order.is_realtime = 0
    if request.data['amount'] == None:
        order.amount = 0
    else:
        order.amount = request.data['amount']
    if request.data['total_discount'] == None:
        order.discount = 0
        order.taxable_amount = request.data['amount']
    else:
        order.discount = request.data['total_discount']
        order.taxable_amount = int(
            request.data['amount']) - float(request.data['total_discount'])
    if request.data['tax_amount'] == None:
        order.tax_amount = 0
    else:
        order.tax_amount = request.data['tax_amount']
    # if request.POST['vat_amount'] == None:
    #     order.vat_amount = 0
    # else:
    #     order.vat_amount = request.POST['vat_amount']
    if request.data['service_amount'] == None:
        order.service_amount = 0
    else:
        order.service_amount = request.data['service_amount']
    order.save()
    for order_item in order_items:
        order_item.ordered = True
        order_item.save()
        order.items.add(order_item)

    order.payment_method = request.data['payment_type']
    order.total_amount = request.data['total_amount']
    order.save()

    if request.data['payment_type'] == 'unpaid':
        table = Table.objects.get(id=request.data['table'])
        table.status = 0
        table.save()

    ct = ContentType.objects.get_for_model(Order)
    LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=order.pk,
                                object_repr=order.bill_no, action_flag=ADDITION, change_message="")


def make_api_call(request):
    if request.data['payment_type'] != 'unpaid':
        #  and request.POST['is_realtime'] == "yes"
        company_info = CompanyInfo.objects.all().first()
        taxable_sales_vat = int(request.data['amount'])
        if request.data['total_discount'] != None:
            taxable_sales_vat = taxable_sales_vat - \
                float(request.data['total_discount'])
        # api call to ird system
        my_data = {
            "username": company_info.ird_username,
            "password": company_info.ird_password,
            "seller_pan": company_info.pan_no,
            "buyer_pan": request.data['customer_pan'],
            "fiscal_year": request.data['financial_year'],
            "buyer_name": request.data['customer_name'],
            "invoice_number": request.data['timestamp'],
            "invoice_date": str(nepali_datetime.date.today().year)+"."+str(nepali_datetime.date.today().month)+"."+str(nepali_datetime.date.today().day),
            "total_sales": request.data['total_amount'],
            "taxable_sales_vat": taxable_sales_vat,
            # "vat": request.POST['vat_amount'],
            "excisable_amount": 0,
            "excise": 0,
            "taxable_sales_hst": 0,
            "hst": 0,
            "amount_for_esf": 0,
            "esf": 0,
            "export_sales": 0,
            "tax_exempted_sales": 0,
            "isrealtime": True,
            "datetimeClient": timezone.now()
        }
        response = requests.post(
            'http://43.245.85.152:9050/api/bill', data=my_data)
        print(response.status_code)


class OrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            orders = OrderSerializer(Order.objects.filter(
                payment_method='unpaid', sales_return=False).order_by('-ordered_date'), many=True).data
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            for order in orders:
                all_items = []
                for item in order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=order['table']).first()).data
                order['items'] = all_items
                order['table'] = table
            context = {
                'title': 'Orders',
                'orders': orders,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_order(request, id):
    if request.method == 'POST':
        try:
            order = Order.objects.get(pk=id)
            order.delete()

            table = Table.objects.get(id=order.table.id)
            table.status = 1
            table.save()

            ct = ContentType.objects.get_for_model(Order)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=order.pk,
                                        object_repr=order.bill_no, action_flag=DELETION, change_message="")

            return Response({"message": "Order deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_order(request, id):
    if request.method == 'GET':
        try:
            if Order.objects.filter(pk=id).first().payment_method == "unpaid":
                categories = Category.objects.filter(status=1)
                products = ProductSerializer(Product.objects.filter(
                    category=categories[0]).filter(status=1), many=True).data
                orders = Order.objects.filter(pk=id)[0].items.all().values()
                tables = TableSerializer(
                    Table.objects.filter(status=1), many=True)
                edit_order = OrderSerializer(Order.objects.get(pk=id)).data
                company_info = CompanyInfoSerializer(
                    CompanyInfo.objects.all(), many=True)

                all_items = []
                for item in edit_order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=edit_order['table']).first()).data
                edit_order['items'] = all_items
                edit_order['table'] = table

                all_products = []
                for product in products:
                    o_item_ids = [a_dict["item_id"] for a_dict in orders]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products.append(product)

                context = {
                    'title': 'Edit Billing',
                    'order_item': orders,
                    'categories': CategorySerializer(categories, many=True).data,
                    'products': all_products,
                    'orders': orders,
                    'edit_order': edit_order,
                    'company_info': company_info.data,
                    'tables': tables.data,
                    'order_id': id
                }

                return Response(context, status=status.HTTP_200_OK)
            return Response({"message": "This order is already saved."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_get_product_by_category(request, order_id, id):
    try:
        if Order.objects.filter(pk=order_id).first().payment_method == "unpaid":
            products = Product.objects.filter(category=id)
            all_products = ProductSerializer(products, many=True).data
            order_item = Order.objects.get(pk=order_id).items.all()
            order_items = OrderItemSerializer(order_item, many=True).data

            all_products_new = []
            for product in all_products:
                o_item_ids = [a_dict["item"] for a_dict in order_items]
                if product["id"] in o_item_ids:
                    product["quantity"] = Order.objects.get(
                        pk=order_id).items.get(item_id=product["id"]).quantity
                else:
                    product["quantity"] = 0
                all_products_new.append(product)

            return JsonResponse({'message': 'Success', 'products': all_products_new, 'order_item': order_items})
        return Response({"message": "This order is already saved."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_add_item_to_order_item(request, order_id, slug):
    try:
        if Order.objects.filter(pk=order_id).first().payment_method == "unpaid":
            item = get_object_or_404(Product, slug=slug)
            # check if the order item is in the order
            order_qs = Order.objects.get(pk=order_id)
            if order_qs.items.filter(item__slug=slug).exists():
                order = order_qs.items.get(item__slug=slug)
                order.quantity += 1
                order.save()

                my_items = order_qs.items.all()
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=order_id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
            else:
                order_item = OrderItem.objects.create(
                    user=request.user,
                    item=item,
                    product=item.name,
                    price=item.price,
                    ordered=True
                )
                order_qs.items.add(order_item)

                my_items = order_qs.items.all()
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=order_id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
        return Response({"message": "This order is already saved."}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_remove_item_from_order_item(request, order_id, slug):
    try:
        if Order.objects.filter(pk=order_id).first().payment_method == "unpaid":
            item = get_object_or_404(Product, slug=slug)
            # check if the order item is in the order
            order_qs = Order.objects.get(pk=order_id)
            if order_qs.items.filter(item__slug=slug).exists():
                order = order_qs.items.get(item__slug=slug)
                if order.quantity > 1:
                    order.quantity -= 1
                    order.save()
                else:
                    order.delete()

                my_items = order_qs.items.all()
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=order_id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
            else:
                return Response({"message": "This item was not in order list"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "This order is already saved."}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_save_order_items(request, order_id):
    try:
        if Order.objects.filter(pk=order_id).first().payment_method == "unpaid":
            with transaction.atomic():
                # open an atomic transaction, i.e. all successful or none
                edit_save_order_db(request, order_id)
                edit_make_api_call(request)
        else:
            return Response({"message": "This order is already saved."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"message": "Error saving order items."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Order item saved successfully"}, status=status.HTTP_200_OK)


def edit_save_order_db(request, order_id):
    order = Order.objects.get(id=order_id)

    prev_table = order.table_id
    current_table = request.data['table']

    if prev_table != current_table:
        order.table_id = request.data['table']
        table = Table.objects.get(id=prev_table)
        table.status = 1
        table.save()
        table = Table.objects.get(id=current_table)
        table.status = 0
        table.save()

    order.customer_name = request.data['customer_name']
    order.customer_pan = request.data['customer_pan']
    # if request.POST['is_realtime'] == "yes":
    order.is_realtime = 1
    # else:
    #     order.is_realtime = 0
    if request.data['amount'] == None:
        order.amount = 0
    else:
        order.amount = request.data['amount']
    if request.data['total_discount'] == None:
        order.discount = 0
        order.taxable_amount = request.data['amount']
    else:
        order.discount = request.data['total_discount']
        order.taxable_amount = int(
            request.data['amount']) - float(request.data['total_discount'])
    if request.data['tax_amount'] == None:
        order.tax_amount = 0
    else:
        order.tax_amount = request.data['tax_amount']
    # if request.data['vat_amount'] == None:
    #     order.vat_amount = 0
    # else:
    #     order.vat_amount = request.data['vat_amount']
    if request.data['service_amount'] == None:
        order.service_amount = 0
    else:
        order.service_amount = request.data['service_amount']
    order.payment_method = request.data['payment_type']
    order.total_amount = request.data['total_amount']
    order.save()

    if request.data['payment_type'] != 'unpaid':
        table = Table.objects.get(id=order.table_id)
        table.status = 1
        table.save()

    ct = ContentType.objects.get_for_model(Order)
    LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                object_id=order.pk, object_repr=order.bill_no, action_flag=CHANGE, change_message="")


def edit_make_api_call(request):
    if request.data['payment_type'] != 'unpaid':
        #  and request.POST['is_realtime'] == "yes"
        company_info = CompanyInfo.objects.all().first()
        taxable_sales_vat = int(request.data['amount'])
        if request.data['total_discount'] != None:
            taxable_sales_vat = taxable_sales_vat - \
                float(request.data['total_discount'])
        # api call to ird system
        my_data = {
            "username": company_info.ird_username,
            "password": company_info.ird_password,
            "seller_pan": company_info.pan_no,
            "buyer_pan": request.data['customer_pan'],
            "fiscal_year": request.data['financial_year'],
            "buyer_name": request.data['customer_name'],
            "invoice_number": request.data['timestamp'],
            "invoice_date": str(nepali_datetime.date.today().year)+"."+str(nepali_datetime.date.today().month)+"."+str(nepali_datetime.date.today().day),
            "total_sales": request.data['total_amount'],
            "taxable_sales_vat": taxable_sales_vat,
            # "vat": request.POST['vat_amount'],
            "excisable_amount": 0,
            "excise": 0,
            "taxable_sales_hst": 0,
            "hst": 0,
            "amount_for_esf": 0,
            "esf": 0,
            "export_sales": 0,
            "tax_exempted_sales": 0,
            "isrealtime": True,
            "datetimeClient": timezone.now()
        }
        response = requests.post(
            'http://43.245.85.152:9050/api/bill', data=my_data)
        print(response.status_code)


class SalesReturnView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            all_orders = OrderSerializer(Order.objects.filter(Q(payment_method='cash') | Q(payment_method='credit') | Q(
                payment_method='card') | Q(payment_method='esewa')).order_by('-ordered_date'), many=True).data
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)

            all_orders_new = []
            for order in all_orders:
                all_items = []
                for item in order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=order['table']).first()).data
                order['items'] = all_items
                order['table'] = table
                all_orders_new.append(order)

            context = {
                'title': 'Sales Return',
                'bills': all_orders_new,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request):
        try:
            data = json.loads(request.body)
            bill_no = data['bill_no']
            bill_name = data['bill_name']
            if bill_no != None and bill_name != None:
                bill = Order.objects.filter(
                    bill_no=bill_no, customer_name=bill_name)
            elif bill_no == None and bill_name != None:
                bill = Order.objects.filter(customer_name=bill_name)
            elif bill_no != None and bill_name == None:
                bill = Order.objects.filter(bill_no=bill_no)
            else:
                bill = Order.objects.all()
            view_bill = OrderSerializer(bill, many=True).data

            all_orders_new = []
            for order in view_bill:
                all_items = []
                for item in order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=order['table']).first()).data
                order['items'] = all_items
                order['table'] = table
                all_orders_new.append(order)
            # items = []
            # report = Order.objects.get(bill_no=bill_no)
            # for item in report.items.all():
            #     items.append(OrderItem.objects.get(pk=item.id).item)
            # view_items = json.dumps(items)

            return JsonResponse({'message': 'Success', 'bill': all_orders_new})
        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def sales_return(request, id):
    if request.method == 'POST':
        try:
            order = Order.objects.get(pk=id)
            if order.sales_return == False:
                order.sales_return = True
                order.sales_return_reason = request.data["return_reason"]
                order.save()

                # api call to ird system
                # if order.is_realtime == 1:
                company_info = CompanyInfo.objects.all().first()
                taxable_sales_vat = int(order.amount)
                if order.discount != None:
                    taxable_sales_vat = taxable_sales_vat - \
                        float(order.discount)
                od = date(order.ordered_date.year,
                          order.ordered_date.month, order.ordered_date.day)
                ordered_date = nepali_datetime.date.from_datetime_date(od)

                # api call to ird system
                my_data = {
                    "username": company_info.ird_username,
                    "password": company_info.ird_password,
                    "seller_pan": company_info.pan_no,
                    "buyer_pan": order.customer_pan,
                    "fiscal_year": order.financial_year,
                    "buyer_name": order.customer_name,
                    "ref_invoice_number": order.bill_no,
                    "credit_note_number": str(id),
                    "credit_note_date": str(ordered_date.year)+"."+str(ordered_date.month)+"."+str(ordered_date.day),
                    "reason_for_return": request.data["return_reason"],
                    "total_sales": order.total_amount,
                    "taxable_sales_vat": taxable_sales_vat,
                    # "vat": order.vat_amount,
                    "excisable_amount": 0,
                    "excise": 0,
                    "taxable_sales_hst": 0,
                    "hst": 0,
                    "amount_for_esf": 0,
                    "esf": 0,
                    "export_sales": 0,
                    "tax_exempted_sales": 0,
                    "isrealtime": True,
                    "datetimeClient": timezone.now()
                }
                response = requests.post(
                    'http://43.245.85.152:9050/api/billreturn', data=my_data)
                print(response)
                return Response({"message": "Sales returned successfully."}, status=status.HTTP_200_OK)
            return Response({"message": "This sale is already returned."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"message": "Error while returning the sales."}, status=status.HTTP_400_BAD_REQUEST)


class SalesReturnReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            sales_returns = OrderSerializer(Order.objects.filter(Q(payment_method='cash') | Q(payment_method='credit') | Q(payment_method='card') | Q(
                payment_method='esewa')).exclude(Q(sales_return=False) | Q(is_realtime=False)).order_by('-ordered_date'), many=True).data
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)

            all_orders_new = []
            for order in sales_returns:
                all_items = []
                for item in order['items']:
                    my_item = OrderItemSerializer(
                        OrderItem.objects.filter(pk=item).first()).data
                    all_items.append(my_item)
                table = TableSerializer(
                    Table.objects.filter(pk=order['table']).first()).data
                order['items'] = all_items
                order['table'] = table
                all_orders_new.append(order)

            context = {
                'title': 'Sales Return Report',
                'sales_returns': sales_returns,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def add_note(request, id):
    if request.method == 'POST':
        try:
            item = get_object_or_404(Product, id=id)
            data = json.loads(request.body)
            # check if the order item is in the order
            if OrderItem.objects.filter(item__slug=item.slug, user=request.user, ordered=False).exists():
                order_item = OrderItem.objects.filter(
                    user=request.user,
                    item=item,
                    ordered=False
                )[0]
                if data['text_note'] != "":
                    order_item.note = data['text_note']
                else:
                    order_item.note = None
                order_item.save()

                my_items = OrderItem.objects.filter(
                    ordered=False, user=request.user)
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = OrderItem.objects.filter(
                            user=request.user, ordered=False, item=product["id"]).first().quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
            else:
                if data['text_note'] != "":
                    order_item, created = OrderItem.objects.get_or_create(
                        user=request.user,
                        item=item,
                        note=data['text_note'],
                        ordered=False
                    )
                else:
                    order_item, created = OrderItem.objects.get_or_create(
                        user=request.user,
                        item=item,
                        ordered=False
                    )

                my_items = OrderItem.objects.filter(
                    ordered=False, user=request.user)
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = OrderItem.objects.filter(
                            user=request.user, ordered=False, item=product["id"]).first().quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_add_note(request, order_id, id):
    if request.method == 'POST':
        try:
            item = get_object_or_404(Product, id=id)
            data = json.loads(request.body)
            # check if the order item is in the order
            order_qs = Order.objects.get(pk=order_id)
            if order_qs.items.filter(item__slug=item.slug).exists():
                order = order_qs.items.get(item__slug=item.slug)
                if data['text_note'] != "":
                    order.note = data['text_note']
                else:
                    order.note = None
                order.save()

                my_items = order_qs.items.all()
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=order_id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
            else:
                if data['text_note'] != "":
                    order_item = OrderItem.objects.create(
                        user=request.user,
                        item=item,
                        note=data['text_note'],
                        ordered=True
                    )
                else:
                    order_item = OrderItem.objects.create(
                        user=request.user,
                        item=item,
                        ordered=True
                    )
                order_qs.items.add(order_item)

                my_items = order_qs.items.all()
                order_items = OrderItemSerializer(my_items, many=True).data
                products = Product.objects.all()
                all_products = ProductSerializer(products, many=True).data

                all_products_new = []
                for product in all_products:
                    o_item_ids = [a_dict["item"] for a_dict in order_items]
                    if product["id"] in o_item_ids:
                        product["quantity"] = Order.objects.get(
                            pk=order_id).items.get(item_id=product["id"]).quantity
                    else:
                        product["quantity"] = 0
                    all_products_new.append(product)

                return JsonResponse({'message': 'Success', 'order_items': order_items, 'all_products': all_products_new})
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TotalReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            # .exclude(payment_method='unpaid')
            monthly_orders = Order.objects.filter(sales_return=False).exclude(payment_method='unpaid').annotate(month=TruncMonth(
                'ordered_date')).values('month').annotate(total=Sum('total_amount')).values('month', 'total').order_by('-month')
            weekly_orders = Order.objects.filter(sales_return=False).exclude(payment_method='unpaid').annotate(week=TruncWeek(
                'ordered_date')).values('week').annotate(total=Sum('total_amount')).values('week', 'total').order_by('-week')
            daily_orders = Order.objects.filter(sales_return=False).exclude(payment_method='unpaid').annotate(day=TruncDay(
                'ordered_date')).values('day').annotate(total=Sum('total_amount')).values('day', 'total').order_by('-day')
            if kwargs['report_type'] == "daily":
                orders = daily_orders
            elif kwargs['report_type'] == "weekly":
                orders = weekly_orders
            else:
                orders = monthly_orders

            context = {
                'title': 'Total report',
                'report_type': kwargs['report_type'],
                'company_info': company_info.data,
                'all_orders': orders.values()
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            product = Product.objects.all().filter(
                slug=kwargs['product_url']).first()
            if product is None:
                product = Product.objects.all().first()
                if product is None:
                    monthly_orders = None
                    weekly_orders = None
                    daily_orders = None
                else:
                    monthly_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(month=TruncDay(
                        'ordered_date')).values('month').annotate(total=Sum('total_price')).values('month', 'total').order_by('-month')
                    weekly_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(week=TruncDay(
                        'ordered_date')).values('week').annotate(total=Sum('total_price')).values('week', 'total').order_by('-week')
                    daily_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(day=TruncDay(
                        'ordered_date')).values('day').annotate(total=Sum('total_price')).values('day', 'total').order_by('-day')
            else:
                monthly_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(month=TruncDay(
                    'ordered_date')).values('month').annotate(total=Sum('total_price')).values('month', 'total').order_by('-month')
                weekly_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(week=TruncDay(
                    'ordered_date')).values('week').annotate(total=Sum('total_price')).values('week', 'total').order_by('-week')
                daily_orders = OrderItem.objects.filter(ordered=True, item=product).annotate(day=TruncDay(
                    'ordered_date')).values('day').annotate(total=Sum('total_price')).values('day', 'total').order_by('-day')

            company_info = CompanyInfo.objects.all()
            products = Product.objects.all()

            if kwargs['report_type'] == "daily":
                orders = daily_orders
            elif kwargs['report_type'] == "weekly":
                orders = weekly_orders
            else:
                orders = monthly_orders

            if product is not None:
                orders = orders.values()

            context = {
                'title': 'Product-wise report',
                'product': ProductSerializer(product).data,
                'report_type': kwargs['report_type'],
                'all_orders': orders,
                'products': ProductSerializer(products, many=True).data,
                'company_info': CompanyInfoSerializer(company_info, many=True).data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def search_category_all(request):
    if request.method == "GET":
        try:
            categories = CategorySerializer(Category.objects.all(), many=True)
            return JsonResponse({'message': 'Success', 'categories': categories.data})
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def search_category(request, query):
    if request.method == "GET":
        try:
            categories = CategorySerializer(
                Category.objects.filter(name__contains=query), many=True)
            return JsonResponse({'message': 'Success', 'categories': categories.data})
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
