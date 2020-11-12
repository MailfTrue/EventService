from django.urls import path
from rest_framework import routers

from .views import CreateUserView, GetCurrentUserView
from events.views import UserEventViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

router = routers.SimpleRouter()
router.register('events', UserEventViewSet, basename='event')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', CreateUserView.as_view(), name="register"),
    path('current-user/', GetCurrentUserView.as_view(), name="current_user"),
    *router.urls
]
