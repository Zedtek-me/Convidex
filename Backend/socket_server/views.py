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
from django.db.models import Q, F

@api_view(["POST"])
def create_meeting(request):
    '''uses rest for meeting creation and signaling'''
    default_user = User.objects.filter(id=1).first()
    db_payload = request.data
    meeting = MeetingSerializer(data=db_payload, partial=True)
    if (meeting.is_valid()):
        meeting.save(owner=default_user)
        return Response({"created":"meeting successfully created!","data":meeting.data}, status=status.HTTP_200_OK)
    print("errors... ", meeting.errors)
    return Response({"error":"invalid request!","errors":meeting.errors}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["POST"])
def join_meeting(request):
    '''user joining meeting'''
    db_payload = request.data
    meeting_id = db_payload.pop("meeting_id")
    meeting_link = db_payload.pop("meeting_link")
    meeting = Meeting.objects.filter(Q(id=meeting_id) | Q(meeting_link=meeting_link)).first()
    default_joiner = User.objects.last()
    if(not meeting):
        raise Exception(f"meeting {'id' if meeting_id else 'link'} is not valid!")
    if(meeting.password and (meeting.password != db_payload.get("meeting_pass"))):
        raise Exception("meeting password is wrong!")
    joining = MeetingJoinerSerializer(data=db_payload, partial=True)
    if(joining.is_valid()):
        joining.save(meeting=meeting, joiner=default_joiner)
        return Response({"joined":"joined meeting successfully!", "data":joining.data}, status=status.HTTP_200_OK)
    return Response(joining.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_ice_candidate(request):
    '''adds an ice candidate from the remote user'''
    pass