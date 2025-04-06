from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from twilio.rest import Client
from decouple import config
from django.utils.translation import gettext as _
from .models import User, LoanRequest, Transaction
from blockchain.blockchain import blockchain  # Ensure this module exists
import random
from datetime import datetime, timedelta

client = Client(config('TWILIO_ACCOUNT_SID'), config('TWILIO_AUTH_TOKEN'))

def send_otp(phone_number):
    otp = random.randint(100000, 999999)
    message = client.messages.create(
        body=f"{_('Your OTP is')} {otp}",
        from_=config('TWILIO_PHONE_NUMBER'),
        to=phone_number
    )
    return otp

def signup(request):
    if request.method == 'POST':
        phone_number = request.POST['phone_number']
        role = request.POST['role']
        if User.objects.filter(phone_number=phone_number).exists():
            return render(request, 'signup.html', {'error': _('Phone number already exists')})
        user = User.objects.create_user(username=phone_number, phone_number=phone_number)
        user.is_lender = (role == 'lender')
        user.is_borrower = (role == 'borrower')
        user.trust_score = 600  # Default trust score
        user.save()
        otp = send_otp(phone_number)
        request.session['otp'] = otp
        request.session['phone_number'] = phone_number
        return redirect('verify_otp')
    return render(request, 'signup.html')

def verify_otp(request):
    if request.method == 'POST':
        entered_otp = request.POST['otp']
        if int(entered_otp) == request.session['otp']:
            user = User.objects.get(phone_number=request.session['phone_number'])
            login(request, user)
            return redirect('dashboard')
        return render(request, 'verify_otp.html', {'error': _('Invalid OTP')})
    return render(request, 'verify_otp.html')

def login_view(request):
    if request.method == 'POST':
        phone_number = request.POST['phone_number']
        try:
            user = User.objects.get(phone_number=phone_number)
            otp = send_otp(phone_number)
            request.session['otp'] = otp
            request.session['phone_number'] = phone_number
            return redirect('verify_otp')
        except User.DoesNotExist:
            return render(request, 'login.html', {'error': _('User not found')})
    return render(request, 'login.html')

@login_required
def dashboard(request):
    if request.user.is_borrower:
        active_loans = LoanRequest.objects.filter(borrower=request.user, status='accepted').values('id', 'amount', 'interest_rate', 'created_at')
        for loan in active_loans:
            due_date = loan['created_at'] + timedelta(days=30)  # Assume 30-day loan term
            days_left = (due_date - datetime.now()).days
            loan['due'] = f"{_('Due in')} {days_left} {_('days')}"
        lenders = User.objects.filter(is_lender=True).values('phone_number', 'wallet_balance')
        interest_payable = sum(loan['amount'] * (loan['interest_rate'] / 100) for loan in active_loans)  # Calculate interest
        context = {
            'user': request.user,
            'active_loans': list(active_loans),
            'lenders': list(lenders),
            'interest_payable': interest_payable,
        }
        return render(request, 'borrower_dashboard.html', context)
    elif request.user.is_lender:
        loans_lent = LoanRequest.objects.filter(lender=request.user, status='accepted').values('borrower__phone_number', 'amount', 'interest_rate', 'created_at')
        for loan in loans_lent:
            due_date = loan['created_at'] + timedelta(days=30)
            days_left = (due_date - datetime.now()).days
            loan['status'] = 'On Time' if days_left > 0 else 'Late'
            loan['due'] = f"{days_left} {_('days')}"
        total_lent = sum(loan['amount'] for loan in loans_lent)
        total_returns = sum(loan['amount'] * (loan['interest_rate'] / 100) for loan in loans_lent)
        context = {
            'user': request.user,
            'loans_lent': list(loans_lent),
            'total_lent': total_lent,
            'total_returns': total_returns,
        }
        return render(request, 'lender_dashboard.html', context)
    return redirect('login')

@login_required
def create_loan_request(request):
    if request.method == 'POST' and request.user.is_borrower:
        amount = request.POST['amount']
        reason = request.POST['reason']
        interest_rate = request.POST.get('interest_rate', 0)
        LoanRequest.objects.create(borrower=request.user, amount=amount, reason=reason, interest_rate=interest_rate)
        return JsonResponse({'status': 'success', 'message': _('Loan request created!')})
    return JsonResponse({'status': 'error', 'message': _('Invalid request')})

@login_required
def lend_money(request):
    if request.method == 'POST' and request.user.is_lender:
        loan_id = request.POST['loan_id']
        loan = LoanRequest.objects.get(id=loan_id)
        if request.user.wallet_balance < loan.amount:
            return JsonResponse({'status': 'error', 'message': _('Insufficient wallet balance')})
        loan.lender = request.user
        loan.status = 'accepted'
        loan.save()
        
        transaction = {
            'from': request.user.phone_number,
            'to': loan.borrower.phone_number,
            'amount': float(loan.amount),
            'type': 'loan'
        }
        blockchain.add_block([transaction])
        
        request.user.wallet_balance -= loan.amount
        loan.borrower.wallet_balance += loan.amount
        request.user.save()
        loan.borrower.save()
        
        Transaction.objects.create(loan=loan, amount=loan.amount, from_wallet=request.user, to_wallet=loan.borrower)
        return JsonResponse({'status': 'success', 'message': _('Loan accepted!')})
    return JsonResponse({'status': 'error', 'message': _('Invalid request')})

@login_required
def get_lenders(request):
    if request.user.is_borrower:
        lenders = User.objects.filter(is_lender=True).values('phone_number', 'wallet_balance')
        return JsonResponse({'lenders': list(lenders)})
    return JsonResponse({'status': 'error', 'message': _('Unauthorized')})

@login_required
def get_loan_requests(request):
    if request.user.is_lender:
        requests = LoanRequest.objects.filter(status='pending').values('id', 'borrower__phone_number', 'amount', 'reason', 'interest_rate')
        return JsonResponse({'requests': list(requests)})
    return JsonResponse({'status': 'error', 'message': _('Unauthorized')})