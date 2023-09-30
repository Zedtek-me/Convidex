import graphene
from socket_server.schema.object_types.types import UserType




class Query(graphene.ObjectType):
    user = graphene.Field(UserType)


