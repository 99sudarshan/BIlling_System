from django.contrib.contenttypes.models import ContentType

from companyinfo.models import CompanyInfo
from companyinfo.serializers import CompanyInfoSerializer
from expenses.models import Expense
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import ExpenseSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

# Create your views here.


class ExpenseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            expenses = ExpenseSerializer(Expense.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Expenses',
                'expenses': expenses.data,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        try:
            name = request.data['name']
            amount = request.data['amount']

            expense = Expense()
            expense.name = name
            expense.amount = amount
            expense.save()

            ct = ContentType.objects.get_for_model(Expense)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=expense.pk, object_repr=expense.name, action_flag=ADDITION, change_message="")

            return Response({"message": "Expense added successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_expense(request, id):
    if request.method == 'POST':
        try:
            expense = Expense.objects.get(pk=id)
            expense.delete()

            ct = ContentType.objects.get_for_model(Expense)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=expense.pk,
                                        object_repr=expense.name, action_flag=DELETION, change_message="")

            return Response({"message": "Expense deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_expense(request, id):
    if request.method == 'GET':
        try:
            expense = ExpenseSerializer(Expense.objects.get(pk=id))
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Edit Expense',
                'expense': expense.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            name = request.data['name']
            amount = request.data['amount']

            expense = Expense.objects.get(pk=id)
            expense.name = name
            expense.amount = amount
            expense.save()

            ct = ContentType.objects.get_for_model(Expense)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=expense.pk, object_repr=expense.name, action_flag=CHANGE, change_message="")

            return Response({"message": "Expense edited successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
