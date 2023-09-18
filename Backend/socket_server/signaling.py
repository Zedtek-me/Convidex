from channels.generic.websocket import WebsocketConsumer
import json

class Signaling(WebsocketConsumer):
    '''signaling server for each peer'''

    def connect(self):
        self.accept()
        self.send("connected to web socket server!")

    
    def receive(self, text_data):
        data = json.loads(text_data)
        self.send(json.dumps(f"received data: {data}"))

    def disconnect(self, code):
        return super().disconnect(code)