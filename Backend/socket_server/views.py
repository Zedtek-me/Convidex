from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from socket_server.models import Meeting, User, MeetingJoiner
import json
from socket_server.serializers import MeetingSerializer, UserSerializer, MeetingJoinerSerializer
from django.utils import timezone

@api_view(["POST"])
def create_meeting(request):
    '''uses rest for meeting creation and signaling'''
    default_user = User.objects.filter(id=1).first()
    data = json.loads(request.body)
    meeting_title = data.get("meeting-title", "Untitled")
    meeting_password = data.get("meeting-password")
    start_date = data.get("start-date")
    end_date = data.get("end-date")
    offer = data.get("offer")
    
    db_payload = {
        "title":meeting_title,
        "password":meeting_password,
        "start_date":start_date,
        "end_date":end_date,
        "owner":default_user,
        "offer":offer
    }

    meeting = MeetingJoinerSerializer(db_payload)
    if (meeting.is_valid(raise_exception=True)):
        return Response("meeting created successfully!", status=status.HTTP_200_OK)
    

@api_view(["POST"])
def join_meeting(request):
    '''user joining meeting'''
    pass


@api_view(["POST"])
def add_ice_candidate(request):
    '''adds an ice candidate from the remote user'''
    pass