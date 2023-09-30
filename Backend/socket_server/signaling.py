from channels.generic.websocket import WebsocketConsumer
import json
from socket_server.models import User, Profile, Meeting, MeetingJoiner
from django.utils import timezone
from datetime import timedelta, datetime
from django.db.models import Q
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()#our publisher

class Signaling(WebsocketConsumer):
    '''signaling server for each peer'''

    def connect(self):
        self.accept()
        # save connected user queue name to db for messages from outside the consumer class
        user = self.scope.get("user")
        try:
            user_profile = Profile.objects.get(owner_id=user.id)
        except Profile.DoesNotExist as e:
            return self.send(json.dumps("logged in user not found!"))
        user_profile.user_queue = self.channel_name
        user_profile.save()
        self.send(json.dumps("connected to web socket server!"))

    
    def receive(self, text_data):
        '''
        receive directly from the connected websocket client.
        decide what to do based on whether it's an offer, answer or others
        '''
        user_id = self.scope.get("user").id
        user = User.objects.filter(id=user_id).first()
        print("user... ", user)
        data = json.loads(text_data)
        print("data.... ", data, "type of data... ", type(data))
        is_offer = False
        ice_candidate = data.get("ice_candidate")
        # for offer
        if data.get("offer"):
            is_offer = True
            meeting = Meeting(
                owner=user,
                title=data.get("title","Untitled"),
                offer=data.get("offer"),
                start_date=data.get("start_date", timezone.now()),
                end_date=data.get("end_date", (timezone.now() + timedelta(hours=24))),
                password=data.get("password")
            )
            meeting.save()
            return self.send(json.dumps({"created":"meeting successfully created!"}))
        
        if (not is_offer) and (not ice_candidate) and (not data.get("message")):
            '''user wants to join our meeting'''           
            meeting_to_join = Meeting.objects.filter(Q(link=data.get("meeting_link") | Q(title__iexact=data.get("meeting_title")))).first()
            if not meeting_to_join:
                return self.send(json.dumps({"no_meeting_found":"meeting not found!"}))
            if not(meeting_to_join.password == data.get("meeting_password")):
                return self.send(json.dump({"invalid_meeting_pass":"meeting password is invalid!"}))
            joined_user = MeetingJoiner(
                joiner=user,
                meeting=meeting_to_join,
                meeting_link=data.get("meeting_link") or None,
                meeting_pass=data.get("meeting_password"),
                answer=data.get("answer")
            )
            joined_user.save()
            meeting_offer = meeting_to_join.offer
            self.send(json.dumps({"joined_meeting_offer": meeting_offer}))

            # check the owner of that meeting here, and get his channel_name, in order to send directly to the channel of the owner
            meeting_owner = meeting_to_join.owner            
            channel_layer.send(
                meeting_owner.profile.user_queue,
                {   "answer":joined_user.answer,
                    "type":"user.queue.hanlder"
                    }    
            ) 

        if ice_candidate:
            '''
            users are sending ice candidates to connecte to each other
            '''
            ellipsis

        if data.get("message"):
            self.send(json.dumps(json.loads(data.get("message"))))

    def disconnect(self, code):
        return super().disconnect(code)

    def user_queue_handler(self, message):
        '''
        handles messages that sent to individual queues
        '''
        message = json.loads(message)
        # determine if it's an invite or an answer to your invite
        if(message.get("answer")):
            '''you got an answer'''
            self.send(json.dumps({
                "acceptance":"answer",
                "answer":message.get("answer")
            }))
        # if it's an ice candidate, determine what to do about it.