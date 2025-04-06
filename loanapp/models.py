from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    is_lender = models.BooleanField(default=False)
    is_borrower = models.BooleanField(default=False)
    trust_score = models.IntegerField(default=0)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    groups = models.ManyToManyField('auth.Group', related_name='loanapp_user_groups', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='loanapp_user_permissions', blank=True)

class LoanRequest(models.Model):
    borrower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='pending')
    lender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='loans_lent')
    created_at = models.DateTimeField(auto_now_add=True)

class Transaction(models.Model):
    loan = models.ForeignKey(LoanRequest, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    from_wallet = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transactions')
    to_wallet = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transactions')