from django.urls import re_path
from socket_server.signaling import Signaling

ws_urls = [
    re_path("signaling/", Signaling.as_asgi(), name="signaling_entry")
]