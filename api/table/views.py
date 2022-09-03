from billing.serializers import OrderSerializer, OrderItemSerializer
from companyinfo.serializers import CompanyInfoSerializer
from .models import *
from .forms import *
from companyinfo.models import *
from billing.models import *
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION
from django.contrib.contenttypes.models import ContentType

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import TableSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


# Create your views here.
class TableView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            tables = TableSerializer(Table.objects.all(), many=True).data
            all_tables = []
            for table in tables:
                table_order = Order.objects.filter(table_id=table['id'], payment_method="unpaid")
                if table_order.exists():
                    order = OrderSerializer(table_order.first()).data
                    all_items = []
                    for item in order['items']:
                        my_item = OrderItemSerializer(OrderItem.objects.filter(pk=item).first()).data
                        all_items.append(my_item)
                    order['items'] = all_items
                    table['order'] = order
                else:
                    table['order'] = {}
                all_tables.append(table)
                
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Tables',
                'tables': all_tables,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        try:
            name = request.data['name']
            capacity = request.data['capacity']
            _status = request.data['status']

            table = Table()
            table.name = name
            table.capacity = capacity
            table.status = _status
            table.save()

            ct = ContentType.objects.get_for_model(Table)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=table.pk, object_repr=table.name, action_flag=ADDITION, change_message="")

            return Response({"message": "Table created successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_table(request, id):
    if request.method == 'POST':
        try:
            table = Table.objects.get(pk=id)

            orders = Order.objects.filter(payment_method='unpaid')
            for order in orders:
                if order.table.id == table.id:
                    return Response({"message": "Error: Please remove this table from active order."}, status=status.HTTP_400_BAD_REQUEST)
            table.delete()

            ct = ContentType.objects.get_for_model(Table)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=table.pk, object_repr=table.name, action_flag=DELETION, change_message="")

            return Response({"message": "Table deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_table(request, id):
    if request.method == 'GET':
        try:
            table = TableSerializer(Table.objects.get(pk=id))
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Product',
                'table': table.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            name = request.data['name']
            capacity = request.data['capacity']
            _status = request.data['status']

            table = Table.objects.get(pk=id)
            table.name = name
            table.capacity = capacity
            table.status = _status
            table.save()

            ct = ContentType.objects.get_for_model(Table)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=table.pk, object_repr=table.name, action_flag=CHANGE, change_message="")

            return Response({"message": "Table edited successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
