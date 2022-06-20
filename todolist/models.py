from django.db import models
import django.utils.timezone as timezone

# Create your models here.

class TodoList(models.Model):

    content = models.TextField(null=False)

class CompleteList(models.Model):

    content = models.TextField(null=False)
    date = models.DateTimeField(default = timezone.now)