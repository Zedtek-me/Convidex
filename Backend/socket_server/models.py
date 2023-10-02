from django.db import models
from django.db.models.manager import Manager
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError
from socket_server.utils.uuid_utils import generate_uuid

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, **kwargs)->AbstractBaseUser:
        if not "email" in kwargs:
            raise ValidationError("Email must be provided!")
        user:AbstractBaseUser = self.model(**kwargs)
        user.is_active = True
        user.set_password(kwargs.get("password"))
        user.save()
        return user

    def create_superuser(self, **kwargs)->AbstractBaseUser:
        user:AbstractBaseUser = self.create_user(**kwargs)
        user.is_admin = True
        user.is_superuser = True
        user.save()
        return user

    
class User(AbstractBaseUser):
    '''
    custom user model
    '''
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=200)
    name = models.CharField(max_length=500)#used for both first name and last name
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = CustomUserManager()

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.username



class Profile(models.Model):
    '''user profile'''
    owner = models.OneToOneField(to="socket_server.User", on_delete=models.CASCADE, null=True, related_name="profile")
    phone_number = models.BinaryField(max_length=12, null=True)
    profile_picture = models.ImageField(upload_to="profile_images/", null=True)
    user_queue = models.CharField(null=True, blank=True)

    class Meta:
        db_table = "user_profile"

    def __str__(self):
        return f"{self.owner.username}'s profile"




class Meeting(models.Model):
    '''all meeting information -- create only'''
    id = models.AutoField(primary_key=True)
    title = models.CharField(verbose_name="meeting title", max_length=(200*1000), null=True, blank=True)
    password = models.CharField(verbose_name="meeting password", max_length=20, null=True, blank=True, validators=[])
    owner = models.ForeignKey(to="socket_server.User", on_delete=models.CASCADE, null=False, related_name="meetings", related_query_name="meetings")
    link = models.UUIDField(verbose_name="meeting link", default=generate_uuid(), null=True, unique=True, blank=True)
    offer = models.JSONField(verbose_name="creator's offer", null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        self.link = generate_uuid()
        super(Meeting, self).save(*args, **kwargs)

    class Meta:
        db_table = "meeting"
        verbose_name = "meeting"
        verbose_name_plural = "meetings"

    def __str__(self):
        return self.title or f"{self.owner.username}'s meeting."
class MeetingJoiner(models.Model):
    '''for joiners of any meetings'''
    id = models.AutoField(primary_key=True)
    joiner = models.ForeignKey(to="socket_server.User", on_delete=models.CASCADE, related_name="joined_meetings", related_query_name="joined_meetings")
    meeting = models.ForeignKey(to="socket_server.Meeting", on_delete=models.CASCADE, related_name="joiners", related_query_name="joiners")
    meeting_link = models.CharField(verbose_name="link",null=True, blank=True)
    meeting_pass = models.CharField(blank=True, null=True)
    answer = models.JSONField(verbose_name="meeting joiner's answer", null=False, blank=False)
    date_joined = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = "meeting_joiner"

    def __str__(self):
        return self.meeting.title or f"joined by {self.joiner.username or self.joiner.email}"