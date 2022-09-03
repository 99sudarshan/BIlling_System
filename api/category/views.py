from billing.models import OrderItem
from companyinfo.serializers import CompanyInfoSerializer
from .models import *
from .forms import *
from companyinfo.models import *
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION
from django.contrib.contenttypes.models import ContentType

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import CategorySerializer, ProductSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


# Create your views here.
class CategoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            categories = CategorySerializer(Category.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Category',
                'categories': categories.data,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        try:
            name = request.data['name']
            _status = request.data['status']

            category = Category()
            category.name = name
            category.status = _status
            category.save()

            ct = ContentType.objects.get_for_model(Category)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=category.pk, object_repr=category.name, action_flag=ADDITION, change_message="")

            return Response({"message": "Category created successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_category(request, id):
    if request.method == 'POST':
        try:
            category = Category.objects.get(pk=id)

            order_item = OrderItem.objects.filter(ordered=False)
            for order in order_item:
                if order.item.category.id == category.id:
                    return Response({"message": "Error: Please remove this category products from active order."}, status=status.HTTP_400_BAD_REQUEST)
            category.delete()

            ct = ContentType.objects.get_for_model(Category)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=category.pk,
                                        object_repr=category.name, action_flag=DELETION, change_message="")

            return Response({"message": "Category deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_category(request, id):
    if request.method == 'GET':
        try:
            category = CategorySerializer(Category.objects.get(pk=id))
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Edit Category',
                'category': category.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            name = request.data['name']
            _status = request.data['status']

            category = Category.objects.get(pk=id)
            category.name = name
            category.status = _status
            category.save()

            ct = ContentType.objects.get_for_model(Category)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=category.pk, object_repr=category.name, action_flag=CHANGE, change_message="")

            return Response({"message": "Category edited successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            products = ProductSerializer(Product.objects.all(), many=True).data
            all_products = []
            for product in products:
                product_category = CategorySerializer(
                    Category.objects.get(pk=product["category"])).data
                product["category"] = product_category
                all_products.append(product)
            categories = CategorySerializer(Category.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Product',
                'products': all_products,
                'categories': categories.data,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        try:
            image = request.data['image']
            name = request.data['name']
            price = request.data['price']
            description = request.data['description']
            category = request.data['category_id']
            _status = request.data['status']

            product = Product()
            product.image = image
            product.name = name
            product.price = price
            product.description = description
            product.category_id = category
            product.status = _status
            product.save()

            ct = ContentType.objects.get_for_model(Product)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=product.pk, object_repr=product.name, action_flag=ADDITION, change_message="")

            return Response({"message": "Product created successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_product(request, id):
    if request.method == 'POST':
        try:
            product = Product.objects.get(pk=id)

            order_item = OrderItem.objects.filter(ordered=False)
            for order in order_item:
                if order.item.id == product.id:
                    return Response({"message": "Error: Please remove the product from active order."}, status=status.HTTP_400_BAD_REQUEST)
            product.delete()

            ct = ContentType.objects.get_for_model(Product)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=product.pk,
                                        object_repr=product.name, action_flag=DELETION, change_message="")

            return Response({"message": "Product deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_product(request, id):
    if request.method == 'GET':
        try:
            product = ProductSerializer(Product.objects.get(pk=id))
            categories = CategorySerializer(Category.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Product',
                'product': product.data,
                'categories': categories.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            image = request.data['image']
            name = request.data['name']
            price = request.data['price']
            description = request.data['description']
            category = request.data['category_id']
            _status = request.data['status']

            product = Product.objects.get(pk=id)
            if image != None and image != "":
                product.image = image
            product.name = name
            product.price = price
            product.description = description
            product.category_id = category
            product.status = _status
            product.save()

            ct = ContentType.objects.get_for_model(Product)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=product.pk, object_repr=product.name, action_flag=CHANGE, change_message="")

            return Response({"message": "Product edited successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
