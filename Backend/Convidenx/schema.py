from socket_server.schema import queries, mutations
from graphene import Schema

schema = Schema(query=queries.query.Query, mutation=mutations.mutation.Mutation)
