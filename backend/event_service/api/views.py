from rest_framework import permissions
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .serializers import UserSerializer


UserModel = get_user_model()


class CreateUserView(CreateAPIView):
    model = UserModel
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer


class GetCurrentUserView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user if self.request.user.is_authenticated else None
