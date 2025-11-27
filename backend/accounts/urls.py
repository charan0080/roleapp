from django.urls import path

from .views import (
    AdminUserDetailView,
    AdminUserListCreateView,
    ChangePasswordView,
    ProfileView,
    RegisterView,
    StudentWelcomeView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("admin/users/", AdminUserListCreateView.as_view(), name="admin_user_list"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin_user_detail"),
    path("student/welcome/", StudentWelcomeView.as_view(), name="student_welcome"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("password/change/", ChangePasswordView.as_view(), name="change_password"),
]
