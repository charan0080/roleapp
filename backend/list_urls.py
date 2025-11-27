import os
import django
from django.urls import get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coplur.settings')
django.setup()

def walk_patterns(patterns, prefix=''):
    for pattern in patterns:
        if hasattr(pattern, 'url_patterns'):
            print(prefix + str(pattern.pattern))
            walk_patterns(pattern.url_patterns, prefix=prefix + str(pattern.pattern))
        else:
            print(prefix + str(pattern.pattern))

resolver = get_resolver()
walk_patterns(resolver.url_patterns)
