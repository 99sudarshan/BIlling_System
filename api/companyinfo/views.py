from django.http import HttpResponse
from .models import *
from .forms import *
from django.conf import settings
from django.core.files import File
from django.utils import timezone
from users.models import *
from django.contrib.auth.models import User, Group
from category.models import *
from billing.models import *
from django.db.models import F, Sum, Func
from django.db import models
from django.db.models.functions import TruncMonth, TruncDay
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION
from django.contrib.contenttypes.models import ContentType
import nepali_datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import CompanyInfoSerializer
from billing.serializers import OrderSerializer
from category.serializers import ProductSerializer
from users.serializers import GroupSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


# Create your views here.
class Month(Func):
    function = 'EXTRACT'
    template = '%(function)s(MONTH from %(expressions)s)'
    output_field = models.IntegerField()


class DashboardView(APIView):
    # add permission to check if user is authenticated
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            users = User.objects.all()
            products = Product.objects.filter(status=1)
            company_info = CompanyInfo.objects.all()
            all_orders = Order.objects.filter(
                sales_return=False).exclude(payment_method='unpaid')
            today_orders = Order.objects.filter(ordered_date__date=timezone.now().strftime(
                '%Y-%m-%d'), sales_return=False).exclude(payment_method='unpaid')
            monthly_orders = Order.objects.filter(sales_return=False).exclude(payment_method='unpaid').annotate(
                month=TruncMonth('ordered_date')).values('month').annotate(total=Sum('total_amount')).values('month', 'total')
            daily_orders = Order.objects.filter(sales_return=False).exclude(payment_method='unpaid').annotate(
                day=TruncDay('ordered_date')).values('day').annotate(total=Sum('total_amount')).values('day', 'total')
            today_sales = 0
            for order in today_orders:
                today_sales += order.total_amount
            # serializers
            user_serializer = UserSerializer(users, many=True)
            products_serializer = ProductSerializer(products, many=True)
            company_info_serializer = CompanyInfoSerializer(
                company_info, many=True)
            all_orders_serializer = OrderSerializer(all_orders, many=True)
            today_orders_serializer = OrderSerializer(today_orders, many=True)
            monthly_orders_serializer = OrderSerializer(
                monthly_orders, many=True)
            daily_orders_serializer = OrderSerializer(daily_orders, many=True)
            context = {
                'title': 'Dashboard',
                'users': user_serializer.data,
                'products': products_serializer.data,
                'company_info': company_info_serializer.data,
                'all_orders': all_orders_serializer.data,
                'monthly_orders': monthly_orders_serializer.data,
                'daily_orders': daily_orders_serializer.data,
                'today_orders': today_orders_serializer.data,
                'today_sales': today_sales,
            }
            return Response(context, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ActionLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            action_logs = LogEntry.objects.all().order_by('-id')[:100].values()
            logs = []
            for log in action_logs:
                logs.append({
                    'user': UserSerializer(User.objects.get(pk=log['user_id'])).data,
                    'content_type': ContentType.objects.get(pk=log['content_type_id']).name,
                    'object_repr': log['object_repr'],
                    'action': log['action_flag'],
                    'change_message': log['change_message'],
                    'date_time': log['action_time']
                })
            context = {
                'title': 'Action Log',
                'action_logs': logs
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CompanyInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            todays_date = nepali_datetime.date.today()
            current_year = todays_date.year
            next_fiscal_year = todays_date.year + 1
            fiscal_year_choice = str(current_year) + \
                '.'+str(next_fiscal_year)[-3:]
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Company Info',
                'fiscal_year_choice': fiscal_year_choice,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        if CompanyInfo.objects.count() == 0:
            try:
                logo = request.data['logo']
                name = request.data['name']
                address = request.data['address']
                phone = request.data['phone']
                # message = request.data['message']
                # vat = request.data['vat']
                tax = request.data['tax']
                service_charge = request.data['service_charge']
                currency = request.data['currency']
                fiscal_year = request.data['fiscal_year']
                pan_no = request.data['pan_no']
                ird_username = request.data['ird_username']
                ird_password = request.data['ird_password']

                company_info = CompanyInfo()
                company_info.logo = logo
                company_info.name = name
                company_info.address = address
                company_info.phone = phone
                company_info.pan_no = pan_no
                # company_info.message = message
                # company_info.VAT = vat
                company_info.Tax = tax
                company_info.service_charge = service_charge
                company_info.currency = currency
                company_info.fiscal_year = fiscal_year
                company_info.ird_username = ird_username
                company_info.ird_password = ird_password
                company_info.save()

                ct = ContentType.objects.get_for_model(CompanyInfo)
                LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk, object_id=company_info.pk,
                                            object_repr=company_info.name, action_flag=ADDITION, change_message="")

                return Response({"message": "Company info created successfully."}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Cannot add more than one company info."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_company_info(request, id):
    if request.method == 'POST':
        try:
            company_info = CompanyInfo.objects.get(pk=id)
            company_info.delete()

            return Response({"message": "Company info deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_company_info(request, id):
    if request.method == 'GET':
        if CompanyInfo.objects.filter(pk=id).exists():
            try:
                todays_date = nepali_datetime.date.today()
                current_year = todays_date.year
                next_fiscal_year = todays_date.year + 1
                fiscal_year_choice = str(current_year) + \
                    '.'+str(next_fiscal_year)[-3:]
                companyinfo = CompanyInfoSerializer(
                    CompanyInfo.objects.get(pk=id))
                company_info = CompanyInfoSerializer(
                    CompanyInfo.objects.all(), many=True)

                context = {
                    'title': 'Edit Company Info',
                    'fiscal_year_choice': fiscal_year_choice,
                    'companyinfo': companyinfo.data,
                    'company_info': company_info.data
                }

                return Response(context, status=status.HTTP_200_OK)
            except:
                return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "No company info with the given id."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PATCH':
        if CompanyInfo.objects.filter(pk=id).exists():
            try:
                logo = request.data['logo']
                name = request.data['name']
                address = request.data['address']
                phone = request.data['phone']
                # message = request.data['message']
                # vat = request.data['vat']
                tax = request.data['tax']
                service_charge = request.data['service_charge']
                currency = request.data['currency']
                fiscal_year = request.data['fiscal_year']
                pan_no = request.data['pan_no']
                ird_username = request.data['ird_username']
                ird_password = request.data['ird_password']

                company_info = CompanyInfo.objects.get(pk=id)
                if logo != None and logo != "":
                    company_info.logo = logo
                company_info.name = name
                company_info.address = address
                company_info.phone = phone
                company_info.pan_no = pan_no
                # company_info.message = message
                # company_info.VAT = vat
                company_info.Tax = tax
                company_info.service_charge = service_charge
                company_info.currency = currency
                company_info.fiscal_year = fiscal_year
                company_info.ird_username = ird_username
                company_info.ird_password = ird_password
                company_info.save()

                return Response({"message": "Company info edited successfully."}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "No company info with the given id."}, status=status.HTTP_404_NOT_FOUND)


class BackupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, request):
        try:
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            return Response({'title': 'Backup', 'company_info': company_info.data}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request):
        db_path = settings.DATABASES['default']['NAME']
        dbfile = File(open(db_path, "rb"))
        response = HttpResponse(dbfile, content_type='application/x-sqlite3')
        response['Content-Disposition'] = 'attachment; filename=%s' % "AntiqueKattiRoll_DBbackup.sqlite3"
        response['Content-Length'] = dbfile.size

        return response


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, request):
        try:
            user = UserSerializer(User.objects.get(pk=request.user.id))
            group = GroupSerializer(
                Group.objects.filter(user=request.user), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            return Response({'title': 'Profile', 'company_info': company_info.data, 'user': user.data, 'group': group.data}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
