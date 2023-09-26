import graphene
from socket_server.schema.object_types.types import MeetingType
from socket_server.utils.kwargs_utils import cherry_pick
from socket_server.models import Meeting

class CreateMeeting(graphene.Mutation):
    '''creates meeting through graphql'''
    message = graphene.String
    meeting = graphene.Field(MeetingType)

    class Arguments:
        title = graphene.String(required=True)
        password = graphene.String()
        start_date = graphene.Date()
        end_date = graphene.Date()

    def mutate(parent, info, **kwargs):
        title, password, start_date, end_date = cherry_pick(["title", "password", "start_date", "end_date"], kwargs)
        pass


class Mutation(graphene.ObjectType):
    create_meeting = CreateMeeting.Field()