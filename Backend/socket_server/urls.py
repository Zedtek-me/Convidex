from django.urls import path
from django.http import HttpResponse
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from socket_server.views import * 

urlpatterns = [
    path("", lambda req:HttpResponse("it works!"), name="dummy_route"),
    path("graph_api/", csrf_exempt(GraphQLView.as_view(graphiql=True)), name="graph_api_home"),
    path("create-meeting/", create_meeting, name="create-meeting"),
    path("join-meeting/", join_meeting, name="join-meeting"),
    path("get-meeting-info/", get_meeting_details, name="get-meeting-info"),
    path("get-joiner-info/", get_meeting_joiner, name="get-joiner-info")
]