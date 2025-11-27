from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AccountsAPITest(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="coplur_admin",
            email="admin@coplur.local",
            password="ChangeMe@123",
            role=User.ADMIN,
        )
        self.register_url = reverse("register")
        self.admin_list_url = reverse("admin_user_list")
        self.student_welcome_url = reverse("student_welcome")

    def authenticate(self, user: User):
        refresh = user.tokens_for_user() if hasattr(user, "tokens_for_user") else None
        if not refresh:
            from rest_framework_simplejwt.tokens import RefreshToken

            refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_registration_prevents_duplicate_user(self):
        payload = {"username": "student1", "email": "student@example.com", "password": "Str0ngPass!"}
        response = self.client.post(self.register_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        duplicate_response = self.client.post(self.register_url, payload)
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", duplicate_response.data)

    def test_admin_can_list_users(self):
        self.authenticate(self.admin_user)
        response = self.client.get(self.admin_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_student_cannot_access_admin_routes(self):
        student = User.objects.create_user(
            username="student1",
            email="student@coplur.local",
            password="Str0ngPass!",
            role=User.STUDENT,
        )
        self.authenticate(student)
        response = self.client.get(self.admin_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_welcome_requires_authentication(self):
        response = self.client.get(self.student_welcome_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        student = User.objects.create_user(
            username="student2",
            email="student2@coplur.local",
            password="Str0ngPass!",
            role=User.STUDENT,
        )
        self.authenticate(student)
        response = self.client.get(self.student_welcome_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], student.username)
