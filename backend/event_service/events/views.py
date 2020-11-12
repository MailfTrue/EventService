from rest_framework import viewsets
from .models import Event, UserEvent
from .serializers import UserEventSerializer
from rest_framework.permissions import IsAuthenticated


class UserEventViewSet(viewsets.ModelViewSet):
    serializer_class = UserEventSerializer
    permission_classes = IsAuthenticated,
    pagination_class = None

    def get_queryset(self):
        return UserEvent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()
