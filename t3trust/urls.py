from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),
    path('', lambda request: redirect('login'), name='root'),
]

urlpatterns += i18n_patterns(
    path('', include('loanapp.urls')),
)