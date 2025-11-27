
from django.core.management.base import BaseCommand

from accounts.models import User


class Command(BaseCommand):
    help = "Seeds the default admin user if it does not exist."

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default="coplur_admin",
            help="Username for the seeded admin user.",
        )
        parser.add_argument(
            "--email",
            default="admin@coplur.local",
            help="Email address for the seeded admin user.",
        )
        parser.add_argument(
            "--password",
            default="ChangeMe@123",
            help="Password for the seeded admin user; change it immediately after first login.",
        )

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        password = options["password"]

        defaults = {
            "email": email,
            "role": User.ADMIN,
            "is_staff": True,
            "is_superuser": True,
        }

        user, created = User.objects.get_or_create(username=username, defaults=defaults)

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created admin user '{username}'."))
        else:
            self.stdout.write(self.style.WARNING(f"Admin user '{username}' already exists."))
