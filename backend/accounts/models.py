from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, email, password, role, **extra_fields):
        if not username:
            raise ValueError("The username must be set")

        email = self.normalize_email(email)
        role = role or self.model.STUDENT
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, role=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, password, role, **extra_fields)

    def create_superuser(self, username, email=None, password=None, role=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True or extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")

        role = role or self.model.ADMIN
        return self._create_user(username, email, password, role, **extra_fields)


class User(AbstractUser):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (STUDENT, "Student"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)

    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
