from socket_server.schema.queries.query import Query
from socket_server.schema.mutations.mutation import Mutation
from graphene import Schema

schema = Schema(query=Query, mutation=Mutation)
