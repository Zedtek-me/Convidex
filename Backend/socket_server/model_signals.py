from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from socket_server.models import Profile

User = get_user_model()

@receiver(post_save, sender=User)
def create_profile(instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(owner=instance)
    return