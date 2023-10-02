import graphene
from socket_server.schema.object_types.types import MeetingType, UserType, MeetingJoinerType
from socket_server.utils.kwargs_utils import cherry_pick
from socket_server.models import Meeting, User
import json
class CreateMeeting(graphene.Mutation):
    '''creates meeting through graphql'''
    message = graphene.String
    meeting = graphene.Field(MeetingType)

    class Arguments:
        title = graphene.String(required=True)
        password = graphene.String()
        start_date = graphene.Date()
        end_date = graphene.Date()
        offer = graphene.JSONString(required=True)

    def mutate(parent, info, **kwargs):
        title, password, start_date, end_date, offer = cherry_pick(["title", "password", "start_date", "end_date", "offer"], kwargs)
        default_user = User.objects.get(id=1)
        meeting = Meeting(
            offer=json.loads(offer),
            title=title,
            password=password,
            start_date=start_date,
            end_date=end_date
        )
        meeting.save()
        return CreateMeeting(
            message="MEETING SUCCESSFULLY CREATED!",
            meeting=meeting
        )


class LoginUser(graphene.Mutation):
    message = graphene.String()
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String()
        password = graphene.String(required=True)

    def mutate(parent, info, **kwargs):
        pass


class CreateAcount(graphene.Mutation):
    message = graphene.String()
    user = graphene.Field(UserType)
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        other_name = graphene.String()
        password = graphene.String(required=True)

    def mutate(parent, info, **kwargs):
        (username, email, other_name, password) = cherry_pick(["username", "email", "other_name", "password"], kwargs)
        user = User.objects.create_user(**{"username":username,"email":email, "name":other_name, 'password':password})
        return CreateAcount(
            message="ACCOUNT CREATED SUCCESSFULLY!",
            user=user
        )
    
class Mutation(graphene.ObjectType):
    create_meeting = CreateMeeting.Field()
    create_account = CreateAcount.Field()
    login_user = LoginUser.Field()