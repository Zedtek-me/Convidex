from rest_framework import serializers
from socket_server.models import User, Meeting, MeetingJoiner

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]

class MeetingSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    class Meta:
        model = Meeting
        fields = "__all__"
    
class MeetingJoinerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingJoiner
        fields = "__all__"