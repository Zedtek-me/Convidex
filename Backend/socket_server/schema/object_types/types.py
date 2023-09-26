import graphene
from graphene_django import DjangoObjectType
from socket_server.models import Meeting, MeetingJoiner, User



class MeetingType(DjangoObjectType):
    class Meta:
        model = Meeting
        fields = "__all__"

    
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"


class MeetingJoinerType(DjangoObjectType):
    class Meta:
        model = MeetingJoiner
        fields = "__all__"