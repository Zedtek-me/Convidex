


class ErrorException(Exception):
    '''a custom exception for customized message'''
    def __init__(self, message:str, other_info:dict, *meta:tuple)->Exception:
        self.message = message
        self.meta = other_info
        super().__init__(message, other_info, *meta)