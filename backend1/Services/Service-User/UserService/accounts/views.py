import random
import string
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserIdsSerializer

def generate_uni_id(role):
    role_lower = role.lower()
    if role_lower == "university":
        return 'UNI' + ''.join(random.choices(string.digits, k=6))
    elif role_lower == "student":
        return 'STD' + ''.join(random.choices(string.digits, k=12))
    elif role_lower == "hostel":
        return 'HST' + ''.join(random.choices(string.digits, k=10))
    return 'USR' + ''.join(random.choices(string.digits, k=8))


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "No active account found with the given credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({"error": "User is inactive"}, status=status.HTTP_401_UNAUTHORIZED)

    if user.email != email:
        return Response({"error": "Email address does not match the username."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['username'] = user.username
    refresh['email'] = user.email

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "role": user.role,
        "username": user.username,
        "email": user.email
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    role = serializer.validated_data['role']

    if User.objects.filter(email=email).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    while True:
        username = generate_uni_id(role)
        if not User.objects.filter(username=username).exists():
            break

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role=role
    )

    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    refresh["username"] = user.username
    refresh["email"] = user.email

    return Response({
        "access_token": str(refresh.access_token),
        "user_id": str(user.username),
        "userId": user.id,
        "role": user.role
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_users_view(request):
    serializer = UserIdsSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    user_ids = serializer.validated_data['user_ids']
    users = User.objects.filter(id__in=user_ids)

    return Response([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email
        }
        for u in users
    ], status=status.HTTP_200_OK)
