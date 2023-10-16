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
from socket_server.utils.exceptions import ErrorException

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
    print("payload... ", db_payload)
    meeting_id = db_payload.get("meeting_id")
    meeting_link = db_payload.get("meeting_link")
    meeting_title = db_payload.get("meeting_title")
    meeting = Meeting.objects.filter(Q(id=meeting_id) | Q(link=meeting_link)| Q(title__iexact=meeting_title)).first()
    default_joiner = User.objects.last()
    if(not meeting):
        return Response(f"meeting {'id' if meeting_id else ('link' if meeting_link else 'credential')} is not valid!", exception=True, status=status.HTTP_404_NOT_FOUND)
    if(meeting.password and (meeting.password != db_payload.get("meeting_pass"))):
        return Response("meeting password is wrong!", exception=True, status=status.HTTP_406_NOT_ACCEPTABLE)
    joining = MeetingJoinerSerializer(data=db_payload, partial=True)
    if(joining.is_valid()):
        joining.save(meeting=meeting, joiner=default_joiner, meeting_link=meeting.link)
        return Response({"joined":"joined meeting successfully!", "data":joining.data}, status=status.HTTP_200_OK)
    return Response(joining.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_ice_candidate(request):
    '''adds an ice candidate from the remote user'''
    pass



@api_view(["POST"])
def get_meeting_details(request):
    meeting_title = request.data.get("meeting_title")
    meeting_id = request.data.get("meeting_id")
    meeting_link = request.data.get("meeting_link")

    found_meeting = Meeting.objects.filter(Q(id=meeting_id) | Q(title__iexact=meeting_title) | Q(link__iexact=meeting_link)).first()
    if not found_meeting:
        return Response({"error": """
            no meeting found with the {'title'if meeting_title else ('id' if meeting_id else 'link')}: {meeting_title or meeting_id or meeting_link}
            """}, exception=True, status=status.HTTP_404_NOT_FOUND)
    serialized_meeting = MeetingSerializer(found_meeting)
    return Response(data=serialized_meeting.data, status=status.HTTP_200_OK)