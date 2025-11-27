import os
import django
from django.urls import resolve, Resolver404
from django.urls.resolvers import get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coplur.settings')
django.setup()

resolver = get_resolver()
for pattern in resolver.url_patterns:
    print(pattern)

try:
    print('register view resolved to', resolve('/api/accounts/register/'))
except Resolver404 as exc:
    print('resolver raised', exc)
except Exception as exc:
    print('error', exc)
