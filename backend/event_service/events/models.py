from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Event(models.Model):
    title = models.CharField("Название", max_length=128)
    start_at = models.DateTimeField("Время начала мероприятия")
    all_day = models.BooleanField(
        "Мероприятие проходит весь день", default=False)
    end_at = models.DateTimeField("Время окончания мероприятия", null=True)

    def __str__(self):
        date_format = "%d.%M.%Y %H:%M"
        return f"{self.title} ({self.start_at.strftime(date_format)} - {self.end_at.strftime(date_format)})"

    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Мероприятия"


class UserEvent(models.Model):
    event = models.ForeignKey(
        'Event', on_delete=models.CASCADE, verbose_name="Мероприятие")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Пользователь")
    note = models.TextField("Заметка", default="")

    def __str__(self):
        return f"{self.event} {self.user}"

    class Meta:
        verbose_name = "Мероприятие пользователя"
        verbose_name_plural = "Мероприятия пользователей"
