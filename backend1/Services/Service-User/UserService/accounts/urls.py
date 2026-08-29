from django.urls import path
from .views import login_view, register_view, get_users_view

urlpatterns = [
    path('login', login_view, name='login'),
    path('register', register_view, name='register'),
    path('get_users', get_users_view, name='get_users'),
]
