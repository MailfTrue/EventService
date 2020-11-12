from rest_framework import serializers
from .models import Event, UserEvent
from api.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = 'id', 'title', 'start_at', 'end_at', 'all_day'


class UserEventSerializer(serializers.ModelSerializer):
    event = EventSerializer()

    def update(self, instance, validated_data):
        event_data = validated_data.pop('event')
        event_serializer = EventSerializer(
            instance.event, data=event_data)
        event_serializer.is_valid(raise_exception=True)
        event_serializer.save()
        return super(UserEventSerializer, self).update(instance, validated_data)

    class Meta:
        model = UserEvent
        fields = "id", "event", "note"
