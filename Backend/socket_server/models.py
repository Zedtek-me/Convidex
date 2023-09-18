from django.db import models
from django.db.models.manager import Manager
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError
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

    def __str__(self):
        return self.username



class Profile(models.Model):
    '''user profile'''
    owner = models.OneToOneField(to="socket_server.User", on_delete=models.CASCADE, null=True, related_name="profile")
    phone_number = models.BinaryField(max_length=12, null=True)
    profile_picture = models.ImageField(upload_to="profile_images/", null=True)


    def __str__(self):
        return f"{self.owner.username}'s profile"