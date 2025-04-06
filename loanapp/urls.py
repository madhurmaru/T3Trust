from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('create_loan_request/', views.create_loan_request, name='create_loan_request'),
    path('lend_money/', views.lend_money, name='lend_money'),
    path('get_lenders/', views.get_lenders, name='get_lenders'),
    path('get_loan_requests/', views.get_loan_requests, name='get_loan_requests'),
]