from users.models import CompanySubscription, Devices, DevicesHistory
from companyinfo.serializers import CompanyInfoSerializer
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import login, authenticate
from companyinfo.models import *
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION, DELETION
from django.contrib.contenttypes.models import ContentType

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import GroupSerializer, PermissionSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
@ratelimit(key='ip', rate='5/s', block=True)
def get_tokens_for_user(request):
    username = request.data['username']
    password = request.data['password']

    # find the user base in params
    if username is None:
        return Response({'message': 'Username not found'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(username=username)
        if not user.check_password(password):
            return Response({'message': 'Username or password doesnot match.'}, status=status.HTTP_400_BAD_REQUEST)

        # Increase active session
        if request.META['HTTP_HOST'] == "localhost:8000":
            subdomain = request.META['HTTP_HOST'].split('localhost')[0]
        elif request.META['HTTP_HOST'] == "127.0.0.1:8000":
            subdomain = request.META['HTTP_HOST'].split('127.0.0.1')[0]
        else:
            subdomain = request.META['HTTP_HOST'].split('127.0.0.1')[0]
            if subdomain != "":
                subdomain = request.META['HTTP_HOST'].split('localhost')[0]

        if subdomain != "":
            subdomain = subdomain.replace('.', '')
            company = CompanySubscription.objects.using('default').filter(
                name=subdomain)
            if company.exists():
                company = company.first()
                if company.subscription_valid_till >= date.today():
                    device = Devices.objects.using(
                        'default').filter(company=company)
                    if device.exists():
                        device = device.first()

                        if device.device_count < device.device_limit:
                            device_history = DevicesHistory.objects.using('default').filter(
                                device_ip=get_client_ip(request), device_user=user.id, device=device)

                            if not device_history.exists():
                                device.device_count = device.device_count + 1
                                device.save(using='default')

                            refresh = RefreshToken.for_user(user)

                            device_history_create = DevicesHistory()
                            device_history_create.device_ip = get_client_ip(
                                request)
                            device_history_create.device_user = user.id
                            device_history_create.device = device
                            device_history_create.refresh_token = str(refresh)
                            device_history_create.save(using='default')
                        else:
                            return Response({'message': 'Active session limit reached.'}, status=status.HTTP_403_FORBIDDEN)
                    else:
                        device = Devices(
                            company=company.first(), device_count=1)
                        device.save(using='default')
                else:
                    return Response({'message': 'Your subscription period has expired. Please renew your subscription to continue.'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'message': 'Add this company to active company list to continue.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_403_FORBIDDEN)


class LogoutView(APIView):

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]

            device_history = DevicesHistory.objects.using(
                'default').filter(refresh_token=refresh_token)

            if device_history.exists():
                device_history = device_history.first()
                device_history_count = DevicesHistory.objects.using('default').filter(
                    device_ip=device_history.device_ip, device_user=device_history.device_user, device_id=device_history.device_id)

                if not device_history_count.count() > 1:
                    # Decrease active session
                    subdomain = request.META['HTTP_HOST'].split('localhost')[0]
                    if subdomain != "":
                        subdomain = subdomain.replace('.', '')
                        company = CompanySubscription.objects.using('default').filter(
                            name=subdomain)
                        if company.exists():
                            device = Devices.objects.using(
                                'default').filter(company=company.first())
                            if device.exists():
                                device = device.first()
                                if device.device_count > 0:
                                    device.device_count = device.device_count - 1
                                    device.save(using='default')
                device_history.delete(using='default')

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "User has been logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
class UsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            users = UserSerializer(User.objects.all(), many=True).data
            all_users = []
            for user in users:
                all_groups = []
                for group in user['groups']:
                    all_groups.append(GroupSerializer(
                        Group.objects.get(pk=group)).data)
                user["groups"] = all_groups
                all_users.append(user)
            groups = GroupSerializer(Group.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Users',
                'users': all_users,
                'groups': groups.data,
                'company_info': company_info.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='POST'))
    def post(self, request, *args, **kwargs):
        try:
            username = request.data['username']
            raw_password = request.data['password1']
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            email = request.data['email']
            group = request.data['group']

            # user = authenticate(username=username, password=raw_password)
            # print(user)
            user = User.objects.create_user(username, email, raw_password)
            # user = User.objects.get(username=username)
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()

            get_group = Group.objects.get(id=group)
            user.groups.add(get_group)

            ct = ContentType.objects.get_for_model(User)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=user.pk, object_repr=user.username, action_flag=ADDITION, change_message="")

            return Response({"message": "User created Sucessfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_user(request, id):
    if request.method == 'POST':
        try:
            user = User.objects.get(pk=id)
            user.delete()

            ct = ContentType.objects.get_for_model(User)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk, object_id=user.pk,
                                        object_repr=user.username, action_flag=DELETION, change_message="")

            return Response({"message": "User deleted Sucessfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_user(request, id):
    if request.method == 'GET':
        try:
            user = UserSerializer(User.objects.get(pk=id))
            groups = GroupSerializer(Group.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Edit User',
                'user': user.data,
                'groups': groups.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            # username = request.data['username']
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            email = request.data['email']
            group = request.data['group']

            user = User.objects.get(pk=id)
            # user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()

            get_group = Group.objects.get(id=group)
            user.groups.clear()
            user.groups.add(get_group)

            ct = ContentType.objects.get_for_model(User)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=user.pk, object_repr=user.username, action_flag=CHANGE, change_message="")

            return Response({"message": "User updated Sucessfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='10/s', block=True, method='GET'))
    def get(self, *args, **kwargs):
        try:
            groups = GroupSerializer(Group.objects.all(), many=True).data
            all_groups = []
            for group in groups:
                group_permissions = []
                for permission in group["permissions"]:
                    group_permissions.append(PermissionSerializer(
                        Permission.objects.get(pk=permission)).data)
                group["permissions"] = group_permissions
                all_groups.append(group)
            permissions = PermissionSerializer(
                Permission.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Groups',
                'groups': all_groups,
                'permissions': permissions.data,
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
            group_permission = request.data['permissions']

            group, created = Group.objects.get_or_create(name=name)
            for perm in group_permission:
                permission = Permission.objects.get(pk=perm)
                group.permissions.add(permission)

            ct = ContentType.objects.get_for_model(Group)
            LogEntry.objects.log_action(user_id=self.request.user.id, content_type_id=ct.pk,
                                        object_id=group.pk, object_repr=group.name, action_flag=ADDITION, change_message="")

            return Response({"message": "Group created successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def delete_group(request, id):
    if request.method == 'POST':
        try:
            group = Group.objects.get(pk=id)
            group.delete()

            ct = ContentType.objects.get_for_model(Group)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=group.pk, object_repr=group.name, action_flag=DELETION, change_message="")

            return Response({"message": "Group deleted successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
@ratelimit(key='ip', rate='10/s', block=True)
def edit_group(request, id):
    if request.method == 'GET':
        try:
            group = GroupSerializer(Group.objects.get(pk=id))
            permissions = PermissionSerializer(
                Permission.objects.all(), many=True)
            company_info = CompanyInfoSerializer(
                CompanyInfo.objects.all(), many=True)
            context = {
                'title': 'Groups',
                'group': group.data,
                'permissions': permissions.data,
                'company_info': company_info.data
            }

            return Response(context, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'PATCH':
        try:
            name = request.data['name']
            group_permission = request.data['permissions']

            group = Group.objects.get(pk=id)
            group.name = name
            group.save()
            group.permissions.clear()
            for perm in group_permission:
                permission = Permission.objects.get(pk=perm)
                group.permissions.add(permission)

            ct = ContentType.objects.get_for_model(Group)
            LogEntry.objects.log_action(user_id=request.user.id, content_type_id=ct.pk,
                                        object_id=group.pk, object_repr=group.name, action_flag=CHANGE, change_message="")

            return Response({"message": "Group edited successfully."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
