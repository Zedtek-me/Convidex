from django.apps import AppConfig


class SocketServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'socket_server'

    def ready(self) -> None:
        import socket_server.model_signals
        return super().ready()